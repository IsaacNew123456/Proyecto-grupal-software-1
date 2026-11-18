import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colores } from '../../constants/theme';

interface LogoProps {
  size?: number;
  color?: string;
}

export const LogoErgoCheck: React.FC<LogoProps> = ({
  size = 28,
  color = Colores.acento,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 3L27 9.35V22.65L16 29L5 22.65V9.35L16 3Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        opacity={0.9}
      />
      <Circle cx={16} cy={11} r={2.5} fill={color} />
      <Path
        d="M16 13.5V23"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx={16} cy={18} r={1.5} fill={color} />
      <Circle cx={16} cy={23} r={2} fill={color} />
      <Path
        d="M11.5 15.5C12.5 14 14.2 13 16 13C17.8 13 19.5 14 20.5 15.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="2, 2"
        opacity={0.7}
      />
    </Svg>
  );
};
