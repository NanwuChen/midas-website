/**
 * Cases Preview Scroll Animation
 * 模拟Gemini的堆叠卡片滚动效果
 */

class CasesScrollAnimation {
  constructor() {
    this.cards = document.querySelectorAll('.case-card');
    this.init();
  }

  init() {
    if (this.cards.length === 0) return;

    // 使用Intersection Observer来优化性能
    this.setupIntersectionObserver();

    // 监听滚动事件
    this.handleScroll();
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16)); // 60fps
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // 添加延迟以创建层叠效果
          const delay = Array.from(this.cards).indexOf(entry.target) * 100;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-10% 0px'
    });

    this.cards.forEach(card => observer.observe(card));
  }

  handleScroll() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;

    this.cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardTop = cardRect.top + scrollY;
      const cardHeight = cardRect.height;
      const dataIndex = card.getAttribute('data-index');

      // 计算滚动进度 - 当卡片开始离开视窗顶部时开始动画
      const scrollStart = cardTop;
      const scrollEnd = cardTop - windowHeight * 1.5; // 1.5倍视窗高度的距离内完成动画
      const scrollProgress = Math.max(0, Math.min(1, (scrollY - scrollStart) / (scrollEnd - scrollStart)));

      // 更平滑的缩放曲线
      const scaleProgress = this.easeOutQuart(scrollProgress);
      const scale = 1 - (scaleProgress * 0.15); // 最大缩小15%
      const opacity = scrollProgress * 0.6; // 最大透明度60%

      // 调试日志（可选，用于测试）
      // if (index === 0 && scrollProgress > 0) {
      //   console.log(`Card ${dataIndex}: progress=${scrollProgress.toFixed(2)}, scale=${scale.toFixed(2)}`);
      // }

      // 应用变换
      if (scrollProgress > 0) {
        card.style.transform = `scale(${scale})`;
        card.style.transformOrigin = 'top center';
        const overlay = card.querySelector('.case-card__overlay');
        if (overlay) {
          overlay.style.opacity = Math.min(opacity, 0.6);
        }
      } else {
        card.style.transform = 'scale(1)';
        const overlay = card.querySelector('.case-card__overlay');
        if (overlay) {
          overlay.style.opacity = '0';
        }
      }
    });
  }

  // 缓动函数，让动画更自然
  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // 节流函数
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.case-card');

  if (cards.length > 0) {
    new CasesScrollAnimation();
  }
});

// 添加reveal动画的CSS类
const style = document.createElement('style');
style.textContent = `
  .case-card:not(.is-visible) {
    opacity: 0;
    transform: translateY(100px);
  }

  .case-card.is-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
`;
document.head.appendChild(style);