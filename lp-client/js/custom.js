/**
 * ARROW pro - カスタムJavaScript
 * FAQアコーディオン、アクセシビリティ、パフォーマンス最適化
 */

document.addEventListener('DOMContentLoaded', function() {
  // ハンバーガーメニューの初期化
  try {
    initHamburgerMenu();
  } catch (error) {
    console.log('ハンバーガーメニューの初期化をスキップしました:', error);
  }
  
  // 基本的なFAQアコーディオンの初期化のみ
  try {
    initFaqAccordion();
  } catch (error) {
    console.log('FAQアコーディオンの初期化をスキップしました:', error);
  }
  
  // アニメーションの初期化
  try {
    initScrollAnimations();
    initTextAnimations();
  } catch (error) {
    console.log('アニメーションの初期化をスキップしました:', error);
  }
  
  // 画像の遅延読み込み設定（一時的に無効化）
  // setupLazyLoading();
  
  // セマンティックHTML改善（一時的に無効化）
  // improveSemantics();
});

/**
 * ハンバーガーメニューの初期化
 */
function initHamburgerMenu() {
  const hamburger = document.querySelector('.header__hamburger');
  const ctaMenu = document.querySelector('.header__nav--mobile');
  
  console.log('Hamburger element:', hamburger);
  console.log('Mobile menu element:', ctaMenu);
  
  if (!hamburger || !ctaMenu) {
    console.log('ハンバーガーメニューまたはモバイルメニューが見つかりません');
    return;
  }
  
  console.log('ハンバーガーメニューの初期化が完了しました');
  
  // ハンバーガーメニューのクリックイベント
  hamburger.addEventListener('click', function() {
    console.log('ハンバーガーメニューがクリックされました');
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    console.log('現在の状態:', isExpanded ? '開いている' : '閉じている');
    
    // aria-expanded の切り替え
    hamburger.setAttribute('aria-expanded', !isExpanded);
    
    // メニューの表示/非表示
    ctaMenu.classList.toggle('active');
    console.log('メニューの新しい状態:', ctaMenu.classList.contains('active') ? '開く' : '閉じる');
    
    // ボディのスクロールを制御（メニューが開いている時はスクロール無効）
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // メニュー外をクリックした時にメニューを閉じる
  document.addEventListener('click', function(e) {
    const isClickInsideMenu = ctaMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);
    
    if (!isClickInsideMenu && !isClickOnHamburger && ctaMenu.classList.contains('active')) {
      hamburger.setAttribute('aria-expanded', 'false');
      ctaMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Escキーでメニューを閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && ctaMenu.classList.contains('active')) {
      hamburger.setAttribute('aria-expanded', 'false');
      ctaMenu.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.focus(); // フォーカスをハンバーガーボタンに戻す
    }
  });
}

/**
 * FAQアコーディオンの初期化
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-item__question');
  
  if (faqQuestions.length === 0) {
    return; // FAQが見つからない場合は何もしない
  }
  
  faqQuestions.forEach(function(question, index) {
    try {
      const qItem = question.closest('.faq-item');
      if (!qItem) return; // faq-itemが見つからない場合はスキップ
      
      const answer = qItem.querySelector('.faq-item__answer');
    
    // アクセシビリティ属性を追加
    const uniqueId = 'faq-answer-' + index;
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', uniqueId);
    question.setAttribute('tabindex', '0');
    
    if (answer) {
      answer.setAttribute('id', uniqueId);
      answer.setAttribute('role', 'region');
      answer.setAttribute('aria-labelledby', 'faq-question-' + index);
    }
    
    const questionText = question.querySelector('.faq-item__q-text');
    if (questionText) {
      questionText.setAttribute('id', 'faq-question-' + index);
    }
    
    // 矢印アイコンは既にHTMLに存在するため、追加不要
    const arrow = question.querySelector('.faq-item__arrow');
    if (arrow) {
      arrow.setAttribute('aria-hidden', 'true');
    }
    
    // トグル関数
    const toggleFaq = function() {
      const isActive = qItem.classList.contains('active');
      
      // 他の開いているFAQを閉じる場合（オプション）
      // closeOtherFaqs(qItem);
      
      // クリックされたFAQを開閉
      qItem.classList.toggle('active');
      question.setAttribute('aria-expanded', !isActive);
    };
    
    // クリックイベント
    question.addEventListener('click', toggleFaq);
    
    // キーボードサポート（Enter、Space）
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq();
      }
    });
    } catch (error) {
      console.log('FAQアコーディオン初期化エラー:', error);
    }
  });
  
  // 初期状態で全てのFAQを閉じた状態にする
  try {
    const allFaqs = document.querySelectorAll('.faq-item');
    allFaqs.forEach(function(faq) {
      faq.classList.remove('active');
      const question = faq.querySelector('.faq-item__question');
      if (question) {
        question.setAttribute('aria-expanded', 'false');
      }
    });
  } catch (error) {
    console.log('FAQの初期化エラー:', error);
  }
}

/**
 * 他の開いているFAQを閉じる（オプション機能）
 */
function closeOtherFaqs(currentItem) {
  document.querySelectorAll('.faq-item.active').forEach(function(item) {
    if (item !== currentItem) {
      item.classList.remove('active');
      const otherQuestion = item.querySelector('.faq-item__question');
      if (otherQuestion) {
        otherQuestion.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

/**
 * 画像の遅延読み込みを設定
 */
function setupLazyLoading() {
  // 一時的に無効化してページ表示を優先
  // const images = document.querySelectorAll('img:not([loading])');
  // images.forEach(function(img, index) {
  //   // ファーストビュー外の画像に lazy loading を適用
  //   if (index > 5) {
  //     img.setAttribute('loading', 'lazy');
  //   }
  // });
}

/**
 * スクロール連動アニメーションの初期化
 */
function initScrollAnimations() {
  // Intersection Observer の設定
  const observerOptions = {
    threshold: 0.1, // 要素の10%が表示されたら発火
    rootMargin: '0px 0px -50px 0px' // 下から50px手前で発火
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // 遅延クラスを確認して適切な遅延を設定
        let delay = 0;
        const classList = entry.target.classList;
        
        if (classList.contains('animate-delay-100')) delay = 100;
        else if (classList.contains('animate-delay-200')) delay = 200;
        else if (classList.contains('animate-delay-300')) delay = 300;
        else if (classList.contains('animate-delay-400')) delay = 400;
        else if (classList.contains('animate-delay-500')) delay = 500;
        else if (classList.contains('animate-delay-600')) delay = 600;
        else if (classList.contains('animate-delay-700')) delay = 700;
        else if (classList.contains('animate-delay-800')) delay = 800;
        
        console.log('アニメーション要素を検出:', entry.target.className, '遅延:', delay + 'ms');
        
        // 遅延後にアニメーションを実行
        setTimeout(function() {
          entry.target.classList.add('animate-visible');
          console.log('アニメーション実行:', entry.target.className);
        }, delay);
        
        // 一度表示されたら監視を停止
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // アニメーション対象要素を監視
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  console.log('アニメーション対象要素数:', animateElements.length);
  animateElements.forEach(function(element) {
    observer.observe(element);
  });
}

/**
 * 文字アニメーションの初期化
 */
function initTextAnimations() {
  // タイプライター効果の初期化
  initTypewriterEffect();
  
  // 文字の一文字ずつ出現アニメーション
  initLetterAnimations();
}

/**
 * タイプライター効果の初期化
 */
function initTypewriterEffect() {
  const typewriterElements = document.querySelectorAll('.typewriter');
  
  typewriterElements.forEach(function(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid #00AFCC';
    
    let i = 0;
    const typeInterval = setInterval(function() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
        // タイプライター完了後、カーソルを点滅させる
        element.style.borderRight = 'none';
      }
    }, 100); // 100ms間隔で文字を表示
  });
}

/**
 * 文字の一文字ずつ出現アニメーション
 */
function initLetterAnimations() {
  const letterElements = document.querySelectorAll('.animate-letters');
  
  letterElements.forEach(function(element) {
    const text = element.textContent;
    element.innerHTML = '';
    
    // 各文字をspanで囲む
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = text[i];
      span.style.animationDelay = (i * 0.1) + 's';
      element.appendChild(span);
    }
  });
}

/**
 * 図形の描画アニメーション（SVG用）
 */
function initShapeAnimations() {
  const svgElements = document.querySelectorAll('.animate-draw');
  
  svgElements.forEach(function(element) {
    const paths = element.querySelectorAll('path, circle, rect, line');
    
    paths.forEach(function(path, index) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.animationDelay = (index * 0.2) + 's';
    });
  });
}

/**
 * カスタムアニメーション関数
 */
function animateElement(element, animationType, duration = 600, delay = 0) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      element.classList.add(animationType);
      
      setTimeout(function() {
        resolve();
      }, duration);
    }, delay);
  });
}

/**
 * 段階的アニメーション（複数要素を順番に表示）
 */
function animateElementsSequentially(elements, animationType, staggerDelay = 200) {
  elements.forEach(function(element, index) {
    animateElement(element, animationType, 600, index * staggerDelay);
  });
}

/**
 * セマンティックHTMLの改善（自動適用）
 */
function improveSemantics() {
  // 各画面レイアウトを処理
  const screens = document.querySelectorAll('.screen');
  
  screens.forEach(function(screen, screenIndex) {
    // problems, benefits, theme, no, faq, cta セクションを処理
    const sections = [
      { selector: '.problems', headingClass: '.text-3, .text-3-2, .text-42, .text-63', label: 'problems' },
      { selector: '.benefits', headingClass: '.text-3, .text-3-2, .text-42, .text-63', label: 'benefits' },
      { selector: '.theme', headingClass: '.text-6-1, .text-75-1', label: 'theme' },
      { selector: '.no', headingClass: '.text-12-1, .text-33-1, .text-54-1, .text-81', label: 'flow' },
      { selector: '.faq', headingClass: '.text-3, .text-39, .text-42, .text-63', label: 'faq' },
      { selector: '.cta', headingClass: '', label: 'cta' }
    ];
    
    sections.forEach(function(sectionData) {
      const sectionEl = screen.querySelector(sectionData.selector);
      if (sectionEl && sectionEl.tagName === 'DIV') {
        // divをsectionに変換（既に変換済みの場合はスキップ）
        const newSection = document.createElement('section');
        Array.from(sectionEl.attributes).forEach(function(attr) {
          newSection.setAttribute(attr.name, attr.value);
        });
        newSection.innerHTML = sectionEl.innerHTML;
        
        const headingId = sectionData.label + '-heading-' + screenIndex;
        newSection.setAttribute('aria-labelledby', headingId);
        
        // 見出しをh2に変換
        if (sectionData.headingClass) {
          const heading = newSection.querySelector(sectionData.headingClass);
          if (heading && heading.tagName === 'DIV') {
            const h2 = document.createElement('h2');
            h2.id = headingId;
            Array.from(heading.attributes).forEach(function(attr) {
              h2.setAttribute(attr.name, attr.value);
            });
            h2.innerHTML = heading.innerHTML;
            heading.parentNode.replaceChild(h2, heading);
          }
        }
        
        sectionEl.parentNode.replaceChild(newSection, sectionEl);
      }
    });
    
    // フッターのナビゲーションリンクにnav要素を追加
    const footerLinks = screen.querySelectorAll('footer .space-y-3-2, footer .space-y-3-6, footer .space-y-3-9, footer .space-y');
    footerLinks.forEach(function(linkContainer, index) {
      if (linkContainer && linkContainer.tagName === 'DIV' && linkContainer.querySelector('a[href*="company"], a[href*="terms"], a[href*="privacy"]')) {
        const nav = document.createElement('nav');
        Array.from(linkContainer.attributes).forEach(function(attr) {
          nav.setAttribute(attr.name, attr.value);
        });
        nav.setAttribute('aria-label', 'フッターナビゲーション');
        nav.innerHTML = linkContainer.innerHTML;
        linkContainer.parentNode.replaceChild(nav, linkContainer);
      }
    });
  });
}

