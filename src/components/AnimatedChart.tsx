import React, { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsap-config';
import { motion } from 'framer-motion';

interface AnimatedChartProps {
  data: number[];
  labels?: string[];
  type?: 'bar' | 'line' | 'pie' | 'donut';
  color?: string;
  height?: number;
  width?: number;
  className?: string;
  animated?: boolean;
}

const AnimatedChart: React.FC<AnimatedChartProps> = ({
  data,
  labels = [],
  type = 'bar',
  color = '#3b82f6',
  height = 200,
  width = 300,
  className = '',
  animated = true
}) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const maxValue = Math.max(...data);

  useEffect(() => {
    if (!animated || !chartRef.current) return;

    const elements = chartRef.current.querySelectorAll('.chart-element');
    
    gsap.fromTo(elements, 
      { 
        scaleY: 0,
        opacity: 0,
        transformOrigin: 'bottom center'
      },
      {
        scaleY: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.8)',
        delay: 0.2
      }
    );

    // Continuous subtle animation
    gsap.to(elements, {
      y: -2,
      duration: 2,
      repeat: -1,
      yoyo: true,
      stagger: 0.1,
      ease: 'sine.inOut'
    });
  }, [animated, data]);

  const renderBarChart = () => {
    const barWidth = (width - 60) / data.length;
    const chartHeight = height - 40;

    return (
      <>
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * chartHeight;
          const x = 30 + index * barWidth + barWidth * 0.1;
          
          return (
            <g key={index}>
              <rect
                className="chart-element"
                x={x}
                y={height - 20 - barHeight}
                width={barWidth * 0.8}
                height={barHeight}
                fill={`url(#gradient-${index})`}
                rx={4}
              />
              {labels[index] && (
                <text
                  x={x + (barWidth * 0.4)}
                  y={height - 5}
                  textAnchor="middle"
                  className="text-xs fill-slate-400"
                >
                  {labels[index]}
                </text>
              )}
              <text
                x={x + (barWidth * 0.4)}
                y={height - 25 - barHeight}
                textAnchor="middle"
                className="text-xs fill-white font-medium"
              >
                {value}
              </text>
            </g>
          );
        })}
      </>
    );
  };

  const renderLineChart = () => {
    const pointSpacing = (width - 60) / (data.length - 1);
    const chartHeight = height - 40;
    
    const points = data.map((value, index) => ({
      x: 30 + index * pointSpacing,
      y: height - 20 - (value / maxValue) * chartHeight
    }));

    const pathData = points.reduce((path, point, index) => {
      return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
    }, '');

    return (
      <>
        <path
          className="chart-element"
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <circle
            key={index}
            className="chart-element"
            cx={point.x}
            cy={point.y}
            r="6"
            fill={color}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </>
    );
  };

  const renderPieChart = () => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const total = data.reduce((sum, value) => sum + value, 0);
    
    let currentAngle = -90;
    
    return (
      <>
        {data.map((value, index) => {
          const angle = (value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
          const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
          const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
          const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          currentAngle += angle;
          
          return (
            <path
              key={index}
              className="chart-element"
              d={pathData}
              fill={`url(#gradient-${index})`}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </>
    );
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <svg
        ref={chartRef}
        width={width}
        height={height}
        className="overflow-visible"
      >
        <defs>
          {data.map((_, index) => (
            <linearGradient
              key={index}
              id={`gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0.3} />
            </linearGradient>
          ))}
        </defs>
        
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {(type === 'pie' || type === 'donut') && renderPieChart()}
      </svg>
      
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-20 blur-xl"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default AnimatedChart;
