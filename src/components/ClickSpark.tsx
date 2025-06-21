'use client'

import React, { useRef, useEffect, useCallback } from "react";

interface ClickSparkProps {
    sparkColor?: string;
    sparkSize?: number;
    sparkRadius?: number;
    sparkCount?: number;
    duration?: number;
    easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
    extraScale?: number;
    children?: React.ReactNode;
    enableRipple?: boolean;
    enableParticles?: boolean;
    enableQuantumEffect?: boolean;
}

interface Spark {
    x: number;
    y: number;
    angle: number;
    startTime: number;
    velocity: number;
    color: string;
    size: number;
}

interface Ripple {
    x: number;
    y: number;
    startTime: number;
    maxRadius: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    startTime: number;
    life: number;
    color: string;
    size: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
    sparkColor = "#6366f1",
    sparkSize = 12,
    sparkRadius = 25,
    sparkCount = 12,
    duration = 600,
    easing = "ease-out",
    extraScale = 1.2,
    enableRipple = true,
    enableParticles = true,
    enableQuantumEffect = true,
    children
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparksRef = useRef<Spark[]>([]);
    const ripplesRef = useRef<Ripple[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        let resizeTimeout: ReturnType<typeof setTimeout>;

        const resizeCanvas = () => {
            const { width, height } = parent.getBoundingClientRect();
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }
        };

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 100);
        };

        const ro = new ResizeObserver(handleResize);
        ro.observe(parent);

        resizeCanvas();

        return () => {
            ro.disconnect();
            clearTimeout(resizeTimeout);
        };
    }, []);

    const easeFunc = useCallback(
        (t: number) => {
            switch (easing) {
                case "linear":
                    return t;
                case "ease-in":
                    return t * t;
                case "ease-in-out":
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                default:
                    return t * (2 - t);
            }
        },
        [easing]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const draw = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }
            ctx?.clearRect(0, 0, canvas.width, canvas.height);

            if (enableRipple) {
                ripplesRef.current = ripplesRef.current.filter((ripple: Ripple) => {
                    const elapsed = timestamp - ripple.startTime;
                    if (elapsed >= duration * 1.5) return false;

                    const progress = elapsed / (duration * 1.5);
                    const eased = easeFunc(progress);
                    const currentRadius = Math.max(0, eased * ripple.maxRadius);
                    const opacity = (1 - eased) * 0.3;

                    // Only draw if radius is positive
                    if (currentRadius > 0) {
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(ripple.x, ripple.y, currentRadius, 0, Math.PI * 2);
                        ctx.stroke();

                        const innerRadius = Math.max(0, currentRadius * 0.7);
                        if (innerRadius > 0) {
                            ctx.strokeStyle = `rgba(147, 51, 234, ${opacity * 0.7})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(ripple.x, ripple.y, innerRadius, 0, Math.PI * 2);
                            ctx.stroke();
                        }
                    }

                    return true;
                });
            }

            sparksRef.current = sparksRef.current.filter((spark: Spark) => {
                const elapsed = timestamp - spark.startTime;
                if (elapsed >= duration) return false;

                const progress = elapsed / duration;
                const eased = easeFunc(progress);

                const distance = eased * sparkRadius * extraScale * spark.velocity;
                const lineLength = spark.size * (1 - eased);
                const opacity = (1 - eased) * 0.8;

                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

                ctx.shadowColor = spark.color;
                ctx.shadowBlur = 10;
                ctx.strokeStyle = spark.color;
                ctx.globalAlpha = opacity;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                ctx.shadowBlur = 0;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                ctx.globalAlpha = 1;
                return true;
            });

            if (enableParticles) {
                particlesRef.current = particlesRef.current.filter((particle: Particle) => {
                    const elapsed = timestamp - particle.startTime;
                    if (elapsed >= particle.life) return false;

                    const progress = elapsed / particle.life;
                    const opacity = (1 - progress) * 0.8;

                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vy += 0.1; 

                    ctx.fillStyle = particle.color;
                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size * (1 - progress * 0.5), 0, Math.PI * 2);
                    ctx.fill();

                    ctx.globalAlpha = 1;
                    return true;
                });
            }

            animationId = requestAnimationFrame(draw);
        };

        animationId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale, enableParticles, enableRipple]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const now = performance.now();

        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
        const newSparks: Spark[] = Array.from({length: sparkCount}, (_, i) => ({
            x,
            y,
            angle: (2 * Math.PI * i) / sparkCount + (Math.random() - 0.5) * 0.3,
            startTime: now + Math.random() * 100, 
            velocity: 0.8 + Math.random() * 0.4,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: sparkSize + Math.random() * 5
        }));

        sparksRef.current.push(...newSparks);

        if (enableRipple) {
            const newRipple: Ripple = {
                x,
                y,
                startTime: now,
                maxRadius: sparkRadius * 2
            };
            ripplesRef.current.push(newRipple);
        }

        if (enableParticles) {
            const particleCount = 15;
            const newParticles: Particle[] = Array.from({length: particleCount}, (_, i) => {
                const angle = (2 * Math.PI * i) / particleCount + Math.random() * 0.5;
                const speed = 2 + Math.random() * 3;
                return {
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - Math.random() * 2,
                    startTime: now + Math.random() * 50,
                    life: 800 + Math.random() * 400,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: 2 + Math.random() * 3
                };
            });
            particlesRef.current.push(...newParticles);
        }

        if (enableQuantumEffect) {
            const quantumSparks: Spark[] = Array.from({length: sparkCount * 2}, () => ({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                angle: Math.random() * Math.PI * 2,
                startTime: now + Math.random() * 200,
                velocity: 0.5 + Math.random() * 0.3,
                color: '#ffffff',
                size: 2 + Math.random() * 3
            }));
            sparksRef.current.push(...quantumSparks);
        }
    };

    return (
        <div style={{
            width:"100%",
            height:"100%",
            position:"relative"
        }}
        onClick={handleClick}
        >
            <canvas
                ref={canvasRef}
                style={{
                   position:"absolute",
                   inset:0,
                   pointerEvents:"none"
                }}
            />
            {children}
        </div>
    );
};

export default ClickSpark;
