import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InvitarUsuarioDto } from './dto/invitar-usuario.dto';
import { Prisma, Rol } from '@prisma/client';
import { BitacoraInmutableService } from '../supervision/services/bitacora-inmutable.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bitacora: BitacoraInmutableService,
  ) {}

  async listarPorOrganizacion(organizationId: string) {
    const membresias = await this.prisma.usuarioOrganizacion.findMany({
      where: { organizacionId: organizationId },
      include: {
        usuario: {
          select: {
            id: true,
            correo: true,
            nombre: true,
            apellido: true,
            fotoUrl: true,
            activo: true,
            creadoEn: true,
          },
        },
        departamento: {
          select: { id: true, nombre: true },
        },
      },
      orderBy: { fechaIngreso: 'desc' },
    });

    return membresias.map((m) => ({
      id: m.usuario.id,
      correo: m.usuario.correo,
      nombre: m.usuario.nombre,
      apellido: m.usuario.apellido,
      fotoUrl: m.usuario.fotoUrl,
      activo: m.usuario.activo,
      rol: m.rol,
      departamento: m.departamento ? m.departamento.nombre : 'Sin asignar',
      departamentoId: m.departamentoId,
      fechaIngreso: m.fechaIngreso,
    }));
  }

  async invitarUsuario(organizationId: string, dto: InvitarUsuarioDto, operadorId?: string) {
    this.validarRolAdministrable(dto.rol);
    const correoNormalizado = dto.correo.trim().toLowerCase();

    if (dto.departamentoId) {
      const departamento = await this.prisma.departamento.findFirst({
        where: { id: dto.departamentoId, organizacionId: organizationId },
        select: { id: true },
      });
      if (!departamento) {
        throw new NotFoundException({
          errorCode: 'ERR_DEPARTMENT_NOT_FOUND',
          message: 'El departamento no pertenece a tu organización.',
        });
      }
    }

    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { correo: correoNormalizado },
      select: {
        membresias: {
          where: { organizacionId: organizationId },
          select: { rol: true },
        },
      },
    });

    if (usuarioExistente && usuarioExistente.membresias.length > 0) {
      this.validarRolAdministrable(usuarioExistente.membresias[0].rol);
      throw new ConflictException({
        errorCode: 'ERR_USER_ALREADY_IN_ORG',
        message: 'Este usuario ya es miembro activo de tu organización.',
      });
    }

    const usuario = usuarioExistente
      ? { connect: { correo: correoNormalizado } }
      : {
          create: {
            correo: correoNormalizado,
            claveHash: await bcrypt.hash('Temporal123!', 12),
            nombre: dto.nombre,
            apellido: dto.apellido,
          },
        };

    try {
      const membresiaCreada = await this.prisma.usuarioOrganizacion.create({
        data: {
          usuario,
          organizacion: { connect: { id: organizationId } },
          departamento: dto.departamentoId
            ? { connect: { id: dto.departamentoId, organizacionId: organizationId } }
            : undefined,
          rol: dto.rol,
        },
        include: {
          usuario: { select: { id: true, correo: true, nombre: true, apellido: true } },
          departamento: { select: { id: true, nombre: true } },
        },
      });

      await this.bitacora.registrar({
        userId: operadorId,
        action: 'INVITAR_USUARIO_ORGANIZACION',
        entity: 'Usuario',
        entityId: membresiaCreada.usuarioId,
        categoria: 'CAMBIOS_POLITICAS',
        details: {
          correo: correoNormalizado,
          rol: dto.rol,
          departamentoId: dto.departamentoId,
          organizacionId: organizationId,
        },
      });

      return membresiaCreada;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({
          errorCode: 'ERR_INVITATION_CONFLICT',
          message: 'Se registró una cuenta o invitación con este correo durante la operación.',
        });
      }
      throw error;
    }
  }

  async cambiarRol(organizationId: string, usuarioId: string, nuevoRol: Rol, operadorId?: string) {
    this.validarRolAdministrable(nuevoRol);
    const where = {
      usuarioId_organizacionId: { usuarioId, organizacionId: organizationId },
    };

    try {
      const actualizado = await this.prisma.usuarioOrganizacion.update({
        where: { ...where, rol: { not: Rol.SUPER_ADMINISTRADOR } },
        data: { rol: nuevoRol },
      });

      await this.bitacora.registrar({
        userId: operadorId,
        action: 'CAMBIO_ROL_USUARIO',
        entity: 'UsuarioOrganizacion',
        entityId: usuarioId,
        categoria: 'CAMBIOS_POLITICAS',
        details: {
          organizacionId: organizationId,
          nuevoRol,
        },
      });

      return actualizado;
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') {
        throw error;
      }
      const membresia = await this.prisma.usuarioOrganizacion.findUnique({
        where,
        select: { rol: true },
      });
      if (membresia) {
        this.validarRolAdministrable(membresia.rol);
      }
      throw new NotFoundException({
        errorCode: 'ERR_USER_NOT_FOUND',
        message: 'El usuario no pertenece a tu organización.',
      });
    }
  }

  private validarRolAdministrable(rol: Rol) {
    if (rol === Rol.SUPER_ADMINISTRADOR) {
      throw new ForbiddenException({
        errorCode: 'ERR_PLATFORM_ROLE_PROTECTED',
        message: 'El rol de superadministrador se gestiona desde la plataforma.',
      });
    }
  }
}
