// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CTAボタンのクリックハンドラ
function handleCTAClick() {
    console.log('CTAボタンがクリックされました');
    alert('サービス登録ページへ遷移します');
    // 実際の実装では、登録ページへのリダイレクトを行う
    // window.location.href = '/register';
}

// ページロード時のアニメーション
document.addEventListener('DOMContentLoaded', function() {
    console.log('ランディングページが読み込まれました');

    // フェードインアニメーション（将来的な拡張用）
    const featureCards = document.querySelectorAll('.feature-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s, transform 0.6s';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    featureCards.forEach(card => {
        observer.observe(card);
    });
});