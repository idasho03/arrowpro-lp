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

