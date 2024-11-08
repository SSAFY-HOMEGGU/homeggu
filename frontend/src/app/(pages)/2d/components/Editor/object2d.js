// object2d.js
import { OBJECT_FAMILIES } from './types';

export class Object2D {
  constructor(family, classe, type, pos, angle, angleSign, size, hinge = 'normal', thick, value) {
    // family 값 검증
    if (!Object.values(OBJECT_FAMILIES).includes(family) && family !== 'byObject') {
      console.warn(`Invalid family type: ${family}. Using default: ${OBJECT_FAMILIES.FREE}`);
      family = OBJECT_FAMILIES.FREE;
    }

    this.family = family;          // inWall, stick, collision, free
    this.class = classe;           // door, window, energy, stair, measure, text
    this.type = type;              // simple, double, simpleSlide, aperture, doubleSlide, fixed, switch, lamp
    this.x = pos.x;
    this.y = pos.y;
    this.angle = angle;
    this.angleSign = angleSign;
    this.limit = [];
    this.hinge = hinge;            // normal, reverse
    this.graph = qSVG.create('none', 'g');
    this.scale = { x: 1, y: 1 };
    this.value = value;
    this.size = size;
    this.thick = thick;
    this.width = (this.size / meter).toFixed(2);
    this.height = (this.thick / meter).toFixed(2);

    this.initializeObject();
  }

  initializeObject() {
    const cc = carpentryCalc(this.class, this.type, this.size, this.thick, this.value);

    // SVG 요소 생성
    cc.forEach(item => {
      let blank;
      if (item.path) {
        blank = qSVG.create('none', 'path', {
          d: item.path,
          'stroke-width': 1,
          fill: item.fill,
          stroke: item.stroke,
          'stroke-dasharray': item.strokeDashArray,
          opacity: item.opacity
        });
      } else if (item.text) {
        blank = qSVG.create('none', 'text', {
          x: item.x,
          y: item.y,
          'font-size': item.fontSize,
          stroke: item.stroke,
          'stroke-width': item.strokeWidth,
          'font-family': 'roboto',
          'text-anchor': 'middle',
          fill: item.fill
        });
        blank[0].textContent = item.text;
      }
      this.graph.append(blank);
    });

    // 바운딩 박스 계산
    const bbox = this.graph.get(0).getBoundingClientRect();
    bbox.x = (bbox.x * factor) - (offset.left * factor) + originX_viewbox;
    bbox.y = (bbox.y * factor) - (offset.top * factor) + originY_viewbox;
    bbox.origin = { x: this.x, y: this.y };
    this.bbox = bbox;

    // 실제 바운딩 박스 초기화
    this.realBbox = [
      { x: -this.size / 2, y: -this.thick / 2 },
      { x: this.size / 2, y: -this.thick / 2 },
      { x: this.size / 2, y: this.thick / 2 },
      { x: -this.size / 2, y: this.thick / 2 }
    ];

    // family와 params 설정
    if (this.family === 'byObject') {
      this.family = cc.family;
    }

    this.params = cc.params;
    this.size = cc.params.width || this.size;
    this.thick = cc.params.height || this.thick;
  }

  update() {
    // 크기 업데이트
    this.width = (this.size / meter).toFixed(2);
    this.height = (this.thick / meter).toFixed(2);

    const cc = carpentryCalc(this.class, this.type, this.size, this.thick, this.value);
    
    // SVG 요소 업데이트
    cc.forEach((item, index) => {
      if (item.path && this.graph.find('path')[index]) {
        this.graph.find('path')[index].setAttribute('d', item.path);
      }
    });

    // 힌지 상태에 따른 변환
    const hingeUpdate = this.hinge === 'normal' ? 1 : -1;
    
    // 변환 매트릭스 적용
    this.graph.attr({
      transform: `translate(${this.x},${this.y}) rotate(${this.angle},0,0) scale(${hingeUpdate}, 1)`
    });

    // 바운딩 박스 업데이트
    const bbox = this.graph.get(0).getBoundingClientRect();
    bbox.x = (bbox.x * factor) - (offset.left * factor) + originX_viewbox;
    bbox.y = (bbox.y * factor) - (offset.top * factor) + originY_viewbox;
    bbox.origin = { x: this.x, y: this.y };
    this.bbox = bbox;

    // 텍스트 객체 특별 처리
    if (this.class === 'text' && this.angle === 0) {
      this.realBbox = [
        { x: this.bbox.x, y: this.bbox.y },
        { x: this.bbox.x + this.bbox.width, y: this.bbox.y },
        { x: this.bbox.x + this.bbox.width, y: this.bbox.y + this.bbox.height },
        { x: this.bbox.x, y: this.bbox.y + this.bbox.height }
      ];
      this.size = this.bbox.width;
      this.thick = this.bbox.height;
    }

    // 회전된 바운딩 박스 계산
    const angleRadian = -(this.angle) * (Math.PI / 180);
    
    this.realBbox = [
      { x: -this.size / 2, y: -this.thick / 2 },
      { x: this.size / 2, y: -this.thick / 2 },
      { x: this.size / 2, y: this.thick / 2 },
      { x: -this.size / 2, y: this.thick / 2 }
    ];

    // 회전 변환 적용
    this.realBbox = this.realBbox.map(point => ({
      x: (point.y * Math.sin(angleRadian) + point.x * Math.cos(angleRadian)) + this.x,
      y: (point.y * Math.cos(angleRadian) - point.x * Math.sin(angleRadian)) + this.y
    }));

    return true;
  }

  // 유틸리티 메서드들
  getBoundingBox() {
    return this.bbox;
  }

  getRealBoundingBox() {
    return this.realBbox;
  }

  getCenter() {
    return {
      x: this.x,
      y: this.y
    };
  }
}