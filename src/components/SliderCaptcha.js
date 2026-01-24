/**
 * 滑块验证组件 - 前端自动生成版
 * @author Your Name
 * @version 2.0.0
 * @description 完全前端实现的滑块验证码组件，无需后端支持
 */

class SliderCaptcha {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {HTMLElement} options.container - 容器元素，默认为 document.body
     * @param {Function} options.onSuccess - 验证成功回调
     * @param {Function} options.onCancel - 取消验证回调
     * @param {Function} options.onError - 验证失败回调
     * @param {String} options.title - 标题，默认"安全验证"
     * @param {String} options.description - 描述文字，默认"向右拖动滑块填充拼图"
     * @param {Number} options.tolerance - 容差范围（像素），默认10
     * @param {Number} options.minTime - 最小验证时间（毫秒），默认300
     * @param {Number} options.maxTime - 最大验证时间（毫秒），默认10000
     * @param {Number} options.puzzleSize - 拼图块大小，默认50
     * @param {Number} options.canvasWidth - 画布宽度，默认320
     * @param {Number} options.canvasHeight - 画布高度，默认180
     */
    constructor(options = {}) {
      this.options = {
        container: options.container || document.body,
        onSuccess: options.onSuccess || (() => {}),
        onCancel: options.onCancel || (() => {}),
        onError: options.onError || (() => {}),
        title: options.title || '安全验证',
        description: options.description || '向右拖动滑块填充拼图',
        tolerance: options.tolerance || 10,
        minTime: options.minTime || 300,
        maxTime: options.maxTime || 10000,
        puzzleSize: options.puzzleSize || 50,
        canvasWidth: options.canvasWidth || 320,
        canvasHeight: options.canvasHeight || 180,
        ...options
      };
  
      this.state = {
        isVerified: false,
        isDragging: false,
        isEnd: false,
        status: 'idle'
      };
  
      this.dragData = {
        startX: 0,
        startTime: 0,
        endTime: 0,
        currentX: 0,
        offsetX: 0
      };
  
      this.puzzleData = {
        targetX: 0,
        targetY: 0,
        puzzleSize: this.options.puzzleSize
      };
  
      this.elements = {};
      this.eventHandlers = {};
      this.uniqueId = `slider-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      this.overlay = null;
    }
  
    /**
     * 初始化组件
     * @returns {Promise<void>}
     */
    async init() {
      this.createDOM();
      this.cacheElements();
      this.bindEvents();
      this.injectStyles();
      await this.generatePuzzle();
    }
  
    /**
     * 注入样式
     */
    injectStyles() {
      if (document.getElementById('slider-captcha-styles')) return;
  
      const style = document.createElement('style');
      style.id = 'slider-captcha-styles';
      style.textContent = `
        .slider-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: sliderFadeIn 0.3s ease;
        }
  
        .slider-overlay.active {
          display: flex;
        }
  
        @keyframes sliderFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
  
        .slider-modal {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          max-width: 400px;
          width: 90%;
          animation: sliderSlideUp 0.3s ease;
        }
  
        @keyframes sliderSlideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
  
        .slider-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
  
        .slider-title {
          font-size: 18px;
          color: #333;
          font-weight: 600;
          margin: 0;
        }
  
        .slider-actions {
          display: flex;
          gap: 10px;
        }
  
        .slider-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 5px;
          border-radius: 4px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
  
        .slider-btn:hover {
          background: #f0f0f0;
          color: #333;
        }
  
        .slider-body {
          padding: 20px;
        }
  
        .puzzle-canvas {
          position: relative;
          width: 320px;
          height: 180px;
          margin: 0 auto 20px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
  
        .puzzle-canvas canvas {
          display: block;
        }
  
        .puzzle-piece {
          position: absolute;
          transition: all 0.2s ease;
          cursor: move;
          filter: brightness(1.1);
        }
  
        .puzzle-piece.dragging {
          transition: none;
        }
  
        .puzzle-piece.success {
          background-color: rgba(76, 175, 80, 0.3);
        }
  
        .puzzle-piece.error {
          background-color: rgba(244, 67, 54, 0.3);
        }
  
        .slider-track {
          position: relative;
          height: 50px;
          background: #f5f5f5;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
  
        .slider-progress {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(90deg, #a8edea 0%, #fed6e3 100%);
          width: 44px;
          transition: all 0.3s ease;
          border-radius: 25px;
        }
  
        .slider-progress.success {
          background: linear-gradient(90deg, #56ab2f 0%, #a8e063 100%);
        }
  
        .slider-progress.error {
          background: linear-gradient(90deg, #eb3349 0%, #f45c43 100%);
        }
  
        .slider-text {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 14px;
          user-select: none;
          pointer-events: none;
        }
  
        .slider-text.success {
          color: #4caf50;
          font-weight: 600;
        }
  
        .slider-text.error {
          color: #f44336;
          font-weight: 600;
        }
  
        .slider-handle {
          position: absolute;
          left: 4px;
          top: 4px;
          width: 42px;
          height: 42px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          cursor: grab;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #667eea;
          font-weight: bold;
          transition: all 0.3s ease;
          user-select: none;
        }
  
        .slider-handle:active {
          cursor: grabbing;
        }
  
        .slider-handle.success {
          background: #4caf50;
          color: white;
        }
  
        .slider-handle.error {
          background: #f44336;
          color: white;
        }
  
        .slider-hint {
          margin-top: 10px;
          text-align: center;
          color: #999;
          font-size: 12px;
          min-height: 18px;
        }
      `;
      document.head.appendChild(style);
    }
  
    /**
     * 创建DOM结构
     */
    createDOM() {
      const overlay = document.createElement('div');
      overlay.className = 'slider-overlay';
      overlay.innerHTML = `
        <div class="slider-modal">
          <div class="slider-header">
            <h3 class="slider-title">${this.options.title}</h3>
            <div class="slider-actions">
              <button class="slider-btn" data-action="refresh" title="刷新">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M20.49 15a9 9 0 01-14.85 3.36L1 14"/>
                </svg>
              </button>
              <button class="slider-btn" data-action="close" title="关闭">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="slider-body">
            <div class="puzzle-canvas" data-canvas="${this.uniqueId}">
              <canvas data-bg="${this.uniqueId}"></canvas>
              <canvas class="puzzle-piece" data-piece="${this.uniqueId}"></canvas>
            </div>
            <div class="slider-track" data-track="${this.uniqueId}">
              <div class="slider-progress" data-progress="${this.uniqueId}"></div>
              <div class="slider-text" data-text="${this.uniqueId}">${this.options.description}</div>
              <div class="slider-handle" data-handle="${this.uniqueId}">≫</div>
            </div>
            <div class="slider-hint" data-hint="${this.uniqueId}"></div>
          </div>
        </div>
      `;
  
      this.options.container.appendChild(overlay);
      this.overlay = overlay;
      console.log('SliderCaptcha: DOM 创建完成', overlay);
    }
  
    /**
     * 缓存DOM元素
     */
    cacheElements() {
      const id = this.uniqueId;
      this.elements = {
        canvas: this.overlay.querySelector(`[data-canvas="${id}"]`),
        bgCanvas: this.overlay.querySelector(`[data-bg="${id}"]`),
        pieceCanvas: this.overlay.querySelector(`[data-piece="${id}"]`),
        track: this.overlay.querySelector(`[data-track="${id}"]`),
        progress: this.overlay.querySelector(`[data-progress="${id}"]`),
        text: this.overlay.querySelector(`[data-text="${id}"]`),
        handle: this.overlay.querySelector(`[data-handle="${id}"]`),
        hint: this.overlay.querySelector(`[data-hint="${id}"]`),
        refreshBtn: this.overlay.querySelector('[data-action="refresh"]'),
        closeBtn: this.overlay.querySelector('[data-action="close"]')
      };
    }
  
    /**
     * 绑定事件
     */
    bindEvents() {
      this.elements.closeBtn.addEventListener('click', () => this.handleCancel());
      this.elements.refreshBtn.addEventListener('click', () => this.refresh());
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.handleCancel();
      });
      this.initDragEvents();
    }
  
    /**
     * 初始化拖拽事件
     */
    initDragEvents() {
      const handle = this.elements.handle;
      handle.addEventListener('mousedown', (e) => this.handleDragStart(e));
      this.eventHandlers.mouseMove = (e) => this.handleDragMove(e);
      this.eventHandlers.mouseUp = () => this.handleDragEnd();
      handle.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: false });
      this.eventHandlers.touchMove = (e) => this.handleDragMove(e);
      this.eventHandlers.touchEnd = () => this.handleDragEnd();
    }
  
    /**
     * 拖拽开始
     */
    handleDragStart(e) {
      if (this.state.isEnd) return;
      e.preventDefault();
      this.state.isDragging = true;
  
      const clientX = e.clientX || e.touches?.[0]?.clientX;
      this.dragData.startX = clientX;
      this.dragData.startTime = Date.now();
  
      this.elements.pieceCanvas.classList.add('dragging');
      this.addGlobalListeners();
    }
  
    /**
     * 拖拽移动
     */
    handleDragMove(e) {
      if (!this.state.isDragging || this.state.isEnd) return;
      e.preventDefault();
      const clientX = e.clientX || e.touches?.[0]?.clientX;
      const deltaX = clientX - this.dragData.startX;
      const trackWidth = this.elements.track.offsetWidth;
      const handleWidth = this.elements.handle.offsetWidth;
      const maxX = trackWidth - handleWidth - 8;
  
      this.dragData.offsetX = Math.max(0, Math.min(deltaX, maxX));
      this.updatePosition(this.dragData.offsetX);
    }
  
    /**
     * 拖拽结束
     */
    handleDragEnd() {
      if (!this.state.isDragging) return;
      this.state.isDragging = false;
      this.dragData.endTime = Date.now();
      this.elements.pieceCanvas.classList.remove('dragging');
      this.removeGlobalListeners();
      this.verify();
    }
  
    /**
     * 更新位置
     */
    updatePosition(offsetX) {
      this.elements.handle.style.transform = `translateX(${offsetX}px)`;
      this.elements.progress.style.width = `${offsetX + 44}px`;
      
      const trackWidth = this.elements.track.offsetWidth;
      const handleWidth = this.elements.handle.offsetWidth;
      const trackMaxOffset = Math.max(1, trackWidth - handleWidth - 8);
      const canvasWidth = this.options.canvasWidth;
      const pieceSize = this.options.puzzleSize;
      const canvasMaxOffset = Math.max(1, canvasWidth - pieceSize);
      
      const pieceX = (offsetX / trackMaxOffset) * canvasMaxOffset;
      const pieceExtend = 20;
      this.elements.pieceCanvas.style.left = `${pieceX - pieceExtend / 2}px`;
      
      this.dragData.currentX = pieceX;
    }
  
    /**
     * 验证
     */
    verify() {
      const duration = this.dragData.endTime - this.dragData.startTime;
      const currentX = this.dragData.currentX;
      const targetX = this.puzzleData.targetX;
      const tolerance = this.options.tolerance;
  
      const isPositionCorrect = Math.abs(currentX - targetX) < tolerance;
      const isTimeValid = duration > this.options.minTime && duration < this.options.maxTime;
  
      if (isPositionCorrect && isTimeValid) {
        this.verifySuccess();
      } else {
        this.verifyError();
      }
    }
  
    /**
     * 验证成功
     */
    verifySuccess() {
      this.state.status = 'success';
      this.state.isEnd = true;
  
      this.elements.text.textContent = '验证成功';
      this.elements.text.classList.add('success');
      this.elements.progress.classList.add('success');
      this.elements.handle.classList.add('success');
      this.elements.pieceCanvas.classList.add('success');
      this.elements.handle.textContent = '✓';
 
      setTimeout(() => {
        this.options.onSuccess({
          duration: this.dragData.endTime - this.dragData.startTime,
          timestamp: Date.now()
        });
        this.hide();
        this.refresh();
      }, 800);
    }
  
    /**
     * 验证失败
     */
    verifyError() {
      this.state.status = 'error';
  
      this.elements.text.textContent = '验证失败，请重试';
      this.elements.text.classList.add('error');
      this.elements.progress.classList.add('error');
      this.elements.handle.classList.add('error');
      this.elements.pieceCanvas.classList.add('error');
      this.elements.handle.textContent = '✗';
  
      this.options.onError({
        duration: this.dragData.endTime - this.dragData.startTime,
        offset: Math.abs(this.dragData.currentX - this.puzzleData.targetX)
      });
  
      setTimeout(() => {
        this.reset();
        this.generatePuzzle();
      }, 1000);
    }
  
    /**
     * 生成拼图
     */
    async generatePuzzle() {
      const bgCanvas = this.elements.bgCanvas;
      const pieceCanvas = this.elements.pieceCanvas;
      const ctx = bgCanvas.getContext('2d');
      const pieceCtx = pieceCanvas.getContext('2d');
  
      bgCanvas.width = this.options.canvasWidth;
      bgCanvas.height = this.options.canvasHeight;
      
      const pieceExtend = 20;
      pieceCanvas.width = this.options.puzzleSize + pieceExtend;
      pieceCanvas.height = this.options.puzzleSize + pieceExtend;
  
      this.drawClearBackground(ctx, bgCanvas.width, bgCanvas.height);
  
      this.puzzleData.targetX = Math.random() * (bgCanvas.width - this.options.puzzleSize - 50) + 50;
      this.puzzleData.targetY = Math.random() * (bgCanvas.height - this.options.puzzleSize - 30) + 15;
  
      this.drawPuzzlePiece(ctx, pieceCtx, this.puzzleData.targetX, this.puzzleData.targetY, pieceExtend);
  
      pieceCanvas.style.left = `${-pieceExtend / 2}px`;
      pieceCanvas.style.top = `${this.puzzleData.targetY - pieceExtend / 2}px`;
    }
  
    /**
     * 绘制清晰背景
     */
    drawClearBackground(ctx, width, height) {
      const patterns = [
        this.drawMountainPattern,
        this.drawOceanPattern,
        this.drawCityPattern,
        this.drawForestPattern
      ];
      
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      pattern.call(this, ctx, width, height);
    }
  
    drawMountainPattern(ctx, width, height) {
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
      skyGradient.addColorStop(0, '#87CEEB');
      skyGradient.addColorStop(1, '#E0F6FF');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);
  
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(width * 0.8, height * 0.2, 25, 0, Math.PI * 2);
      ctx.fill();
  
      ctx.fillStyle = '#8B7355';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height * 0.6);
      ctx.lineTo(width * 0.3, height * 0.4);
      ctx.lineTo(width * 0.5, height * 0.5);
      ctx.lineTo(width * 0.7, height * 0.3);
      ctx.lineTo(width, height * 0.5);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
  
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height * 0.4);
      ctx.lineTo(width * 0.25, height * 0.45);
      ctx.lineTo(width * 0.35, height * 0.45);
      ctx.closePath();
      ctx.fill();
  
      ctx.beginPath();
      ctx.moveTo(width * 0.7, height * 0.3);
      ctx.lineTo(width * 0.65, height * 0.35);
      ctx.lineTo(width * 0.75, height * 0.35);
      ctx.closePath();
      ctx.fill();
  
      const grassGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
      grassGradient.addColorStop(0, '#90EE90');
      grassGradient.addColorStop(1, '#228B22');
      ctx.fillStyle = grassGradient;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);
  
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * width;
        const y = height * 0.7 + Math.random() * 30;
        this.drawTree(ctx, x, y);
      }
    }
  
    drawOceanPattern(ctx, width, height) {
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.5);
      skyGradient.addColorStop(0, '#FFB6C1');
      skyGradient.addColorStop(1, '#87CEEB');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height * 0.5);
  
      const oceanGradient = ctx.createLinearGradient(0, height * 0.5, 0, height);
      oceanGradient.addColorStop(0, '#4682B4');
      oceanGradient.addColorStop(1, '#1E3A8A');
      ctx.fillStyle = oceanGradient;
      ctx.fillRect(0, height * 0.5, width, height * 0.5);
  
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const y = height * 0.5 + i * 20;
        for (let x = 0; x < width; x += 20) {
          const waveY = y + Math.sin((x + i * 30) * 0.05) * 5;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
  
      this.drawSailboat(ctx, width * 0.7, height * 0.5);
  
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * width;
        const y = height * 0.2 + Math.random() * height * 0.2;
        this.drawBird(ctx, x, y);
      }
    }
  
    drawCityPattern(ctx, width, height) {
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
      skyGradient.addColorStop(0, '#FF6B6B');
      skyGradient.addColorStop(0.5, '#FFB347');
      skyGradient.addColorStop(1, '#FFA07A');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);
  
      const buildings = [
        {x: 0, width: 60, height: height * 0.5},
        {x: 65, width: 50, height: height * 0.6},
        {x: 120, width: 70, height: height * 0.4},
        {x: 195, width: 45, height: height * 0.55},
        {x: 245, width: 75, height: height * 0.45}
      ];
  
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      buildings.forEach(building => {
        ctx.fillRect(building.x, height - building.height, building.width, building.height);
        
        ctx.fillStyle = '#FFD700';
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 4; col++) {
            if (Math.random() > 0.3) {
              ctx.fillRect(
                building.x + 10 + col * 12,
                height - building.height + 10 + row * 15,
                8, 10
              );
            }
          }
        }
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      });
    }
  
    drawForestPattern(ctx, width, height) {
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.5);
      skyGradient.addColorStop(0, '#B4E7CE');
      skyGradient.addColorStop(1, '#E8F5E9');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);
  
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, height * 0.8, width, height * 0.2);
  
      ctx.fillStyle = '#7CB342';
      ctx.fillRect(0, height * 0.75, width, height * 0.05);
  
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * width;
        const y = height * 0.5 + Math.random() * height * 0.3;
        const scale = 0.5 + Math.random() * 0.5;
        this.drawTree(ctx, x, y, scale);
      }
  
      for (let i = 0; i < 4; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.3;
        this.drawCloud(ctx, x, y);
      }
    }
  
    drawTree(ctx, x, y, scale = 1) {
      ctx.fillStyle = '#654321';
      ctx.fillRect(x - 5 * scale, y, 10 * scale, 30 * scale);
  
      ctx.fillStyle = '#2D5016';
      ctx.beginPath();
      ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  
    drawSailboat(ctx, x, y) {
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(x - 20, y + 10);
      ctx.lineTo(x + 20, y + 10);
      ctx.lineTo(x + 15, y + 25);
      ctx.lineTo(x - 15, y + 25);
      ctx.closePath();
      ctx.fill();
  
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + 10);
      ctx.lineTo(x, y - 30);
      ctx.stroke();
  
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(x, y - 30);
      ctx.lineTo(x + 15, y);
      ctx.lineTo(x, y + 10);
      ctx.closePath();
      ctx.fill();
    }
  
    drawBird(ctx, x, y) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 5, y);
      ctx.quadraticCurveTo(x - 3, y - 3, x, y);
      ctx.quadraticCurveTo(x + 3, y - 3, x + 5, y);
      ctx.stroke();
    }
  
    drawCloud(ctx, x, y) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.arc(x + 15, y, 20, 0, Math.PI * 2);
      ctx.arc(x + 30, y, 15, 0, Math.PI * 2);
      ctx.fill();
    }
  
    /**
     * 绘制拼图块
     */
    drawPuzzlePiece(bgCtx, pieceCtx, x, y, pieceExtend) {
      const size = this.options.puzzleSize;
      const r = 10;
      const offset = pieceExtend / 2;
  
      const imageData = bgCtx.getImageData(
        x - offset, 
        y - offset, 
        size + pieceExtend, 
        size + pieceExtend
      );
      
      bgCtx.save();
      bgCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      bgCtx.lineWidth = 3;
      this.drawPuzzleShape(bgCtx, x, y, size, r);
      bgCtx.stroke();
      
      bgCtx.globalCompositeOperation = 'destination-out';
      this.drawPuzzleShape(bgCtx, x, y, size, r);
      bgCtx.fill();
      bgCtx.restore();
      
      pieceCtx.save();
      pieceCtx.putImageData(imageData, 0, 0);
      pieceCtx.globalCompositeOperation = 'destination-in';
      this.drawPuzzleShape(pieceCtx, offset, offset, size, r);
      pieceCtx.fill();
      pieceCtx.globalCompositeOperation = 'source-over';
      
      pieceCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      pieceCtx.lineWidth = 3;
      pieceCtx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      pieceCtx.shadowBlur = 5;
      this.drawPuzzleShape(pieceCtx, offset, offset, size, r);
      pieceCtx.stroke();
      pieceCtx.restore();
    }

    /**
     * 绘制拼图形状
     */
    drawPuzzleShape(ctx, x, y, size, r) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size - r, y);
      ctx.arc(x + size - r, y + r, r, -Math.PI / 2, 0, false);
      ctx.lineTo(x + size, y + size - r);
      ctx.arc(x + size - r, y + size - r, r, 0, Math.PI / 2, false);
      ctx.lineTo(x + r, y + size);
      ctx.arc(x + r, y + size - r, r, Math.PI / 2, Math.PI, false);
      ctx.lineTo(x, y + r);
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
      ctx.closePath();
    }

    /**
     * 添加全局事件监听器
     */
    addGlobalListeners() {
      document.addEventListener('mousemove', this.eventHandlers.mouseMove);
      document.addEventListener('mouseup', this.eventHandlers.mouseUp);
      document.addEventListener('touchmove', this.eventHandlers.touchMove, { passive: false });
      document.addEventListener('touchend', this.eventHandlers.touchEnd);
    }

    /**
     * 移除全局事件监听器
     */
    removeGlobalListeners() {
      document.removeEventListener('mousemove', this.eventHandlers.mouseMove);
      document.removeEventListener('mouseup', this.eventHandlers.mouseUp);
      document.removeEventListener('touchmove', this.eventHandlers.touchMove);
      document.removeEventListener('touchend', this.eventHandlers.touchEnd);
    }

    /**
     * 重置状态
     */
    reset() {
      this.state.isDragging = false;
      this.state.isEnd = false;
      this.state.status = 'idle';
      
      this.dragData.offsetX = 0;
      this.dragData.currentX = 0;
      this.dragData.startX = 0;
      this.dragData.startTime = 0;
      this.dragData.endTime = 0;

      this.elements.handle.style.transform = 'translateX(0px)';
      this.elements.progress.style.width = '44px';
      this.elements.progress.classList.remove('success', 'error');
      this.elements.text.classList.remove('success', 'error');
      this.elements.text.textContent = this.options.description;
      this.elements.handle.classList.remove('success', 'error');
      this.elements.handle.textContent = '≫';
      this.elements.pieceCanvas.classList.remove('success', 'error', 'dragging');
      this.elements.hint.textContent = '';

      const pieceExtend = 20;
      this.elements.pieceCanvas.style.left = `${-pieceExtend / 2}px`;
    }

    /**
     * 显示组件
     */
    show() {
      if (!this.overlay) {
        console.warn('SliderCaptcha: overlay 未初始化，请先调用 init()');
        return;
      }
      console.log('SliderCaptcha: 显示验证码弹窗', this.overlay);
      this.overlay.classList.add('active');
      // 确保样式生效
      this.overlay.style.display = 'flex';
    }

    /**
     * 隐藏组件
     */
    hide() {
      if (this.overlay) {
        this.overlay.classList.remove('active');
        this.overlay.style.display = 'none';
      }
    }

    /**
     * 刷新拼图
     */
    async refresh() {
      this.reset();
      await this.generatePuzzle();
    }

    /**
     * 处理取消操作
     */
    handleCancel() {
      this.hide();
      this.reset();
      this.options.onCancel();
    }

    /**
     * 销毁组件
     */
    destroy() {
      this.removeGlobalListeners();
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.overlay = null;
      this.elements = {};
      this.eventHandlers = {};
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SliderCaptcha;
}
if (typeof window !== 'undefined') {
  window.SliderCaptcha = SliderCaptcha;
}
export default SliderCaptcha;