document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('documentRequestForm');
    const submitButton = document.getElementById('submitButton');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const isLocalPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);

    // 同意チェックはsubmit時にバリデーションで判定

    // URLからrefパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref') || 'Untracked';

    function saveRequestData(companyName, representativeName, email, phone) {
        const storageData = {
            company_name: companyName,
            representative_name: representativeName,
            email: email,
            phone: phone,
            saved_at: new Date().toISOString()
        };
        localStorage.setItem('arrowpro_document_request', JSON.stringify(storageData));
    }

    // ブロック対象のメールドメインリストを取得
    let blockedEmailDomains = [];
    fetch('/api/not-free-email')
        .then(response => response.json())
        .then(data => {
            blockedEmailDomains = data.blockedDomains || [];
        })
        .catch(error => {
            console.error('ブロックドメインリスト取得エラー:', error);
        });

    // 電話番号入力を半角数字のみに制限
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        const value = e.target.value;
        const phoneRegex = /^[0-9]*$/;
        if (!phoneRegex.test(value)) {
            e.target.value = value.replace(/[^0-9]/g, '');
        }
    });

    // フォーム送信
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // エラーをクリア
        clearErrors();

        // バリデーション
        let isValid = true;
        const errors = {};

        const companyName = document.getElementById('companyName').value.trim();
        const representativeName = document.getElementById('representativeName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const agreeTerms = agreeTermsCheckbox.checked;

        if (!companyName) {
            errors.companyName = '会社名を入力してください';
            isValid = false;
        }

        if (!representativeName) {
            errors.representativeName = '担当者名を入力してください';
            isValid = false;
        }

        if (!email) {
            errors.email = 'メールアドレスを入力してください';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = '有効なメールアドレスを入力してください';
            isValid = false;
        } else {
            // フリーメールチェック
            const emailDomain = email.split('@')[1]?.toLowerCase();
            if (emailDomain && blockedEmailDomains.includes(emailDomain)) {
                errors.email = '法人のメールアドレスをご入力ください';
                isValid = false;
            }
        }

        if (!phone) {
            errors.phone = '電話番号を入力してください';
            isValid = false;
        } else if (!/^[0-9]+$/.test(phone)) {
            errors.phone = '電話番号は半角数字で入力してください';
            isValid = false;
        } else if (phone.length > 20) {
            errors.phone = '電話番号は20文字以内で入力してください';
            isValid = false;
        }

        if (!agreeTerms) {
            errors.agreeTerms = 'プライバシーポリシーに同意してください';
            isValid = false;
        }

        if (!isValid) {
            showErrors(errors);
            return;
        }

        // 送信データを作成
        const requestData = {
            company_name: companyName,
            // backend互換: API側でcompany_name_kanaが必須のため暫定的に会社名を送る
            company_name_kana: companyName,
            representative_name: representativeName,
            email: email,
            phone: phone,
            ref: refParam
        };

        // ローカル静的確認時はAPI送信せず完了画面へ遷移
        if (isLocalPreview) {
            saveRequestData(companyName, representativeName, email, phone);
            window.location.href = '/request/completed/';
            return;
        }

        // ボタンを無効化
        submitButton.disabled = true;

        // API送信
        fetch('/api/lead/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(async response => {
            const contentType = response.headers.get('content-type') || '';
            const status = response.status;
            const requestId = response.headers.get('x-request-id') || response.headers.get('x-amzn-requestid') || '';
            const rawBody = await response.text();

            // 本番障害の切り分け用に、失敗時の応答情報を残す
            if (!response.ok) {
                console.error('資料請求送信APIエラー', {
                    status: status,
                    contentType: contentType,
                    requestId: requestId,
                    rawBody: rawBody
                });
            }

            if (!contentType.includes('application/json')) {
                return {
                    success: false,
                    message: 'サーバー応答形式が不正です。',
                    debug: { status: status, requestId: requestId }
                };
            }

            try {
                return JSON.parse(rawBody);
            } catch (parseError) {
                console.error('資料請求送信APIのJSON解析エラー', {
                    status: status,
                    requestId: requestId,
                    rawBody: rawBody,
                    error: parseError
                });
                return {
                    success: false,
                    message: 'サーバー応答の解析に失敗しました。',
                    debug: { status: status, requestId: requestId }
                };
            }
        })
        .then(data => {
            if (data.success) {
                // LocalStorageに保存（/client/registerで利用）
                saveRequestData(companyName, representativeName, email, phone);

                // 完了ページへリダイレクト
                window.location.href = '/request/completed/';
            } else {
                submitButton.disabled = false;

                if (data.errors) {
                    const errorMessages = {};
                    if (data.errors.company_name) errorMessages.companyName = data.errors.company_name[0];
                    if (data.errors.company_name_kana) errorMessages.companyName = data.errors.company_name_kana[0];
                    if (data.errors.representative_name) errorMessages.representativeName = data.errors.representative_name[0];
                    if (data.errors.email) errorMessages.email = data.errors.email[0];
                    if (data.errors.phone) errorMessages.phone = data.errors.phone[0];
                    showErrors(errorMessages);
                } else {
                    console.log(data)
                    alert(data.message || 'エラーが発生しました。');
                }
            }
        })
        .catch(error => {
            console.error('送信エラー:', error);
            submitButton.disabled = false;
            alert('通信エラーが発生しました。しばらく時間をおいてから再度お試しください。');
        });
    });

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });
        document.querySelectorAll('.form-input, .form-select').forEach(el => {
            el.classList.remove('error');
        });
    }

    function showErrors(errors) {
        Object.keys(errors).forEach(key => {
            const errorEl = document.getElementById(key + 'Error');
            const inputEl = document.getElementById(key);
            if (errorEl) {
                errorEl.textContent = errors[key];
                errorEl.classList.add('show');
            }
            if (inputEl) {
                inputEl.classList.add('error');
            }
        });
    }
});
