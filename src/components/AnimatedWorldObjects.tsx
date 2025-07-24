import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AnimatedWorldObjects = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    svg.attr('width', width).attr('height', height);

    // Clear previous content
    svg.selectAll('*').remove();

    // Create floating particles with tech symbols
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 1,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      type: ['circle', 'square', 'triangle', 'diamond', 'hexagon'][Math.floor(Math.random() * 5)],
      opacity: Math.random() * 0.8 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01
    }));

    // Create constellation network
    const nodes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 2,
      connected: [],
      energy: Math.random()
    }));

    // Create connections between nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i !== j) {
          const distance = Math.sqrt(Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2));
          if (distance < 300 && Math.random() > 0.6) {
            node.connected.push(other);
          }
        }
      });
    });

    // Matrix rain effect
    const matrixChars = '01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ</>{}()[]';
    const matrixColumns = Array.from({ length: Math.floor(width / 20) }, (_, i) => ({
      x: i * 20,
      drops: Array.from({ length: Math.floor(Math.random() * 5 + 1) }, () => ({
        y: Math.random() * height,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2
      }))
    }));

    // Create gradient definitions
    const defs = svg.append('defs');
    
    const gradientColors = [
      ['#8B5CF6', '#06B6D4'], // purple to cyan
      ['#EC4899', '#F97316'], // pink to orange
      ['#06B6D4', '#10B981'], // cyan to green
      ['#8B5CF6', '#EC4899'], // purple to pink
      ['#F97316', '#EAB308'] // orange to yellow
    ];

    gradientColors.forEach((colors, i) => {
      const gradient = defs.append('radialGradient')
        .attr('id', `gradient-${i}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colors[0])
        .attr('stop-opacity', 0.9);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colors[1])
        .attr('stop-opacity', 0.3);
    });

    // Create animated background grid
    const gridGroup = svg.append('g').attr('class', 'grid');
    const gridSpacing = 100;
    
    for (let x = 0; x <= width; x += gridSpacing) {
      gridGroup.append('line')
        .attr('x1', x)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', height)
        .attr('stroke', 'url(#gradient-0)')
        .attr('stroke-width', 0.2)
        .attr('opacity', 0.1)
        .attr('stroke-dasharray', '2,8')
        .append('animateTransform')
        .attr('attributeName', 'stroke-dashoffset')
        .attr('values', '0;10')
        .attr('dur', '3s')
        .attr('repeatCount', 'indefinite');
    }
    
    for (let y = 0; y <= height; y += gridSpacing) {
      gridGroup.append('line')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', width)
        .attr('y2', y)
        .attr('stroke', 'url(#gradient-1)')
        .attr('stroke-width', 0.2)
        .attr('opacity', 0.1)
        .attr('stroke-dasharray', '2,8')
        .append('animateTransform')
        .attr('attributeName', 'stroke-dashoffset')
        .attr('values', '0;10')
        .attr('dur', '4s')
        .attr('repeatCount', 'indefinite');
    }

    // Draw constellation connections with energy flow
    const connections = svg.append('g').attr('class', 'connections');
    nodes.forEach(node => {
      node.connected.forEach(connected => {
        const line = connections.append('line')
          .attr('x1', node.x)
          .attr('y1', node.y)
          .attr('x2', connected.x)
          .attr('y2', connected.y)
          .attr('stroke', 'url(#gradient-0)')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '6,6')
          .attr('opacity', 0.6);
        
        // Energy flow animation
        line.append('animate')
          .attr('attributeName', 'stroke-dashoffset')
          .attr('values', '0;12')
          .attr('dur', '2s')
          .attr('repeatCount', 'indefinite');
          
        line.append('animate')
          .attr('attributeName', 'opacity')
          .attr('values', '0.3;0.8;0.3')
          .attr('dur', '3s')
          .attr('repeatCount', 'indefinite');
      });
    });

    // Draw constellation nodes with complex animations
    const nodeGroup = svg.append('g').attr('class', 'nodes');
    nodes.forEach((node, i) => {
      const nodeElement = nodeGroup.append('g')
        .attr('transform', `translate(${node.x}, ${node.y})`);
      
      // Outer glow ring
      nodeElement.append('circle')
        .attr('r', node.radius * 3)
        .attr('fill', 'none')
        .attr('stroke', `url(#gradient-${i % gradientColors.length})`)
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.3)
        .append('animate')
        .attr('attributeName', 'r')
        .attr('values', `${node.radius * 2};${node.radius * 4};${node.radius * 2}`)
        .attr('dur', `${3 + Math.random() * 2}s`)
        .attr('repeatCount', 'indefinite');
      
      // Main node
      const mainNode = nodeElement.append('circle')
        .attr('r', node.radius)
        .attr('fill', `url(#gradient-${i % gradientColors.length})`)
        .attr('opacity', 0.8);
      
      // Pulsing animation
      mainNode.append('animate')
        .attr('attributeName', 'r')
        .attr('values', `${node.radius};${node.radius * 1.5};${node.radius}`)
        .attr('dur', `${2 + Math.random() * 2}s`)
        .attr('repeatCount', 'indefinite');
    });

    // Matrix rain animation
    const matrixGroup = svg.append('g').attr('class', 'matrix-rain');
    
    function updateMatrix() {
      matrixColumns.forEach(column => {
        column.drops.forEach(drop => {
          drop.y += drop.speed;
          if (drop.y > height + 20) {
            drop.y = -20;
            drop.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          }
        });
      });

      const matrixElements = matrixGroup.selectAll('.matrix-char')
        .data(matrixColumns.flatMap(col => 
          col.drops.map(drop => ({ ...drop, x: col.x }))
        ));

      matrixElements.enter()
        .append('text')
        .attr('class', 'matrix-char')
        .attr('font-family', 'monospace')
        .attr('font-size', '14px')
        .attr('fill', 'url(#gradient-2)')
        .attr('text-anchor', 'middle');

      matrixElements
        .text(d => d.char)
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('opacity', d => d.opacity * 0.4);

      matrixElements.exit().remove();
    }

    // Animate floating particles with complex shapes
    const particleGroup = svg.append('g').attr('class', 'particles');
    
    function updateParticles() {
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen edges
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
      });

      const particleElements = particleGroup.selectAll('.particle')
        .data(particles, (d: any) => d.id);

      particleElements.enter()
        .append('g')
        .attr('class', 'particle')
        .each(function(d) {
          const group = d3.select(this);
          
          if (d.type === 'circle') {
            group.append('circle')
              .attr('r', d.radius)
              .attr('fill', `url(#gradient-${d.id % gradientColors.length})`)
              .attr('opacity', d.opacity);
          } else if (d.type === 'square') {
            group.append('rect')
              .attr('width', d.radius * 2)
              .attr('height', d.radius * 2)
              .attr('x', -d.radius)
              .attr('y', -d.radius)
              .attr('fill', `url(#gradient-${d.id % gradientColors.length})`)
              .attr('opacity', d.opacity);
          } else if (d.type === 'triangle') {
            group.append('polygon')
              .attr('points', `0,-${d.radius} -${d.radius * 0.866},${d.radius * 0.5} ${d.radius * 0.866},${d.radius * 0.5}`)
              .attr('fill', `url(#gradient-${d.id % gradientColors.length})`)
              .attr('opacity', d.opacity);
          } else if (d.type === 'diamond') {
            group.append('polygon')
              .attr('points', `0,-${d.radius} ${d.radius},0 0,${d.radius} -${d.radius},0`)
              .attr('fill', `url(#gradient-${d.id % gradientColors.length})`)
              .attr('opacity', d.opacity);
          } else if (d.type === 'hexagon') {
            const points = Array.from({ length: 6 }, (_, i) => {
              const angle = (i * Math.PI * 2) / 6;
              const x = Math.cos(angle) * d.radius;
              const y = Math.sin(angle) * d.radius;
              return `${x},${y}`;
            }).join(' ');
            group.append('polygon')
              .attr('points', points)
              .attr('fill', `url(#gradient-${d.id % gradientColors.length})`)
              .attr('opacity', d.opacity);
          }
        });

      particleElements
        .attr('transform', d => {
          const time = Date.now() * d.pulseSpeed;
          const scale = 1 + Math.sin(time) * 0.3;
          const rotation = time * 0.5;
          return `translate(${d.x}, ${d.y}) scale(${scale}) rotate(${rotation})`;
        });
    }

    // Create animated waves
    const waveGroup = svg.append('g').attr('class', 'waves');
    
    for (let i = 0; i < 5; i++) {
      const wave = waveGroup.append('path')
        .attr('fill', 'none')
        .attr('stroke', `url(#gradient-${i % gradientColors.length})`)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.15);

      const animate = () => {
        const time = Date.now() * 0.001;
        const amplitude = 40 + i * 10;
        const frequency = 0.015 + i * 0.005;
        const phase = i * Math.PI / 4;
        const yOffset = height * 0.8 + i * 30;
        
        let pathData = `M 0 ${yOffset}`;
        for (let x = 0; x <= width; x += 8) {
          const y = yOffset + Math.sin(x * frequency + time + phase) * amplitude;
          pathData += ` L ${x} ${y}`;
        }
        
        wave.attr('d', pathData);
      };

      setInterval(animate, 50);
    }

    // Animation loop
    const animate = () => {
      updateParticles();
      updateMatrix();
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      svg.attr('width', newWidth).attr('height', newHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full opacity-70"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
};

export default AnimatedWorldObjects;
