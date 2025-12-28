/**
 * ARROW pro - カスタムJavaScript
 * FAQアコーディオン、アクセシビリティ、パフォーマンス最適化
 */

document.addEventListener('DOMContentLoaded', function () {
  // refパラメータの引き継ぎ
  try {
    initRefParameter();
  } catch (error) {
  }

  // ハンバーガーメニューの初期化
  try {
    initHamburgerMenu();
  } catch (error) {
  }

  // 基本的なFAQアコーディオンの初期化のみ
  try {
    initFaqAccordion();
  } catch (error) {
  }

  // アニメーションの初期化
  try {
    initScrollAnimations();
    initTextAnimations();
  } catch (error) {
  }

  // 固定CTAバーの初期化
  try {
    initFixedCtaBar();
  } catch (error) {
  }

  // 画像の遅延読み込み設定（一時的に無効化）
  // setupLazyLoading();

  // セマンティックHTML改善（HTML側で対応済みのため削除）
  // improveSemantics();
});

/**
 * クエリパラメータを新規登録リンクに引き継ぐ
 */
function initRefParameter() {
  const currentQuery = window.location.search;

  if (!currentQuery) {
    return; // クエリパラメータがない場合は何もしない
  }

  // 新規登録リンクを全て取得
  const registerLinks = document.querySelectorAll('a[href*="/client/register"]');

  registerLinks.forEach(function (link) {
    try {
      const url = new URL(link.href);
      // 現在のクエリパラメータを全てマージ
      new URLSearchParams(currentQuery).forEach(function (value, key) {
        url.searchParams.set(key, value);
      });
      link.href = url.toString();
    } catch (error) {
      // URL解析エラーは無視
    }
  });
}

/**
 * ハンバーガーメニューの初期化
 */
function initHamburgerMenu() {
  const hamburger = document.querySelector('.header__hamburger');
  const ctaMenu = document.querySelector('.header__nav--mobile');


  if (!hamburger || !ctaMenu) {
    return;
  }


  // ハンバーガーメニューのクリックイベント
  hamburger.addEventListener('click', function () {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';

    // aria-expanded の切り替え
    hamburger.setAttribute('aria-expanded', !isExpanded);

    // メニューの表示/非表示
    ctaMenu.classList.toggle('active');

    // ボディのスクロールを制御（メニューが開いている時はスクロール無効）
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // メニュー外をクリックした時にメニューを閉じる
  document.addEventListener('click', function (e) {
    const isClickInsideMenu = ctaMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    if (!isClickInsideMenu && !isClickOnHamburger && ctaMenu.classList.contains('active')) {
      hamburger.setAttribute('aria-expanded', 'false');
      ctaMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Escキーでメニューを閉じる
  document.addEventListener('keydown', function (e) {
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

  faqQuestions.forEach(function (question, index) {
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
      const toggleFaq = function () {
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
      question.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFaq();
        }
      });
    } catch (error) {
    }
  });

  // 初期状態で全てのFAQを閉じた状態にする
  try {
    const allFaqs = document.querySelectorAll('.faq-item');
    allFaqs.forEach(function (faq) {
      faq.classList.remove('active');
      const question = faq.querySelector('.faq-item__question');
      if (question) {
        question.setAttribute('aria-expanded', 'false');
      }
    });
  } catch (error) {
  }
}

/**
 * 他の開いているFAQを閉じる（オプション機能）
 */
function closeOtherFaqs(currentItem) {
  document.querySelectorAll('.faq-item.active').forEach(function (item) {
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

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
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

        // 遅延後にアニメーションを実行
        setTimeout(function () {
          entry.target.classList.add('animate-visible');
        }, delay);

        // 一度表示されたら監視を停止
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // アニメーション対象要素を監視
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  animateElements.forEach(function (element) {
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

  typewriterElements.forEach(function (element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid #00AFCC';

    let i = 0;
    const typeInterval = setInterval(function () {
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

  letterElements.forEach(function (element) {
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

  svgElements.forEach(function (element) {
    const paths = element.querySelectorAll('path, circle, rect, line');

    paths.forEach(function (path, index) {
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
  return new Promise(function (resolve) {
    setTimeout(function () {
      element.classList.add(animationType);

      setTimeout(function () {
        resolve();
      }, duration);
    }, delay);
  });
}

/**
 * 段階的アニメーション（複数要素を順番に表示）
 */
function animateElementsSequentially(elements, animationType, staggerDelay = 200) {
  elements.forEach(function (element, index) {
    animateElement(element, animationType, 600, index * staggerDelay);
  });
}

/**
 * Fixed CTA Barの表示制御
 * スクロール位置に応じて表示/非表示を切り替える
 */
function initFixedCtaBar() {
  const fixedCtaBar = document.querySelector(".fixed-cta-bar");
  if (!fixedCtaBar) return;

  const scrollThreshold = 300; // 300pxスクロールしたら表示

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (scrollY > scrollThreshold) {
      fixedCtaBar.classList.add("fixed-cta-bar--visible");
    } else {
      fixedCtaBar.classList.remove("fixed-cta-bar--visible");
    }
  }

  // スクロールイベントリスナーを追加（パフォーマンス向上のためrequestAnimationFrame使用）
  let ticking = false;
  window.addEventListener("scroll", function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // 初期状態をチェック
  handleScroll();
}



