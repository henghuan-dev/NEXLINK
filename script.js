// =========================================================
// script.js — NEXLINK corporate site (renewal v7-C)
// お問い合わせフォーム（reCAPTCHA v3 → API Gateway）／共通UI
// =========================================================

// 🌟🌟🌟 API GatewayのエンドポイントURLを設定 🌟🌟🌟
        const API_ENDPOINT = 'https://0rn89v3rzk.execute-api.ap-northeast-1.amazonaws.com/prod/contact'; 

        // 🌟🌟🌟 reCAPTCHA v3 サイトキーを設定 🌟🌟🌟
        // 【重要】ご自身のサイトキーに置き換えてください。
        const recaptchaSiteKey = '6LdepRksAAAAAI9SjMUO4xMJhElrMVBCrpwshxC7';

document.addEventListener('DOMContentLoaded', () => {
            
            // フォーム要素の取得
            const form = document.getElementById('contact-form');
            const submitButton = document.getElementById('submit-button');
            const formMessage = document.getElementById('form-message');

            // ----------------------------------------------------
            // 送信完了ポップアップの開閉
            // ----------------------------------------------------
            const successModal = document.getElementById('submit-success-modal');
            const successModalClose = document.getElementById('submit-success-close');

            const closeSuccessModal = () => {
                if (successModal) successModal.hidden = true;
            };

            if (successModalClose) {
                successModalClose.addEventListener('click', closeSuccessModal);
            }
            if (successModal) {
                successModal.addEventListener('click', (e) => {
                    if (e.target === successModal) closeSuccessModal();
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') closeSuccessModal();
                });
            }
            
            // 必須フィールドのIDリスト
            const allInputFields = ['name', 'email', 'tel', 'subject', 'message'];// グレーアウト対象

            // ----------------------------------------------------
            // フォームの入力状態を制御する関数
            // ----------------------------------------------------
            const setFormState = (disabled) => {
                allInputFields.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.disabled = disabled;
                    }
                });
                
                const privacyCheck = document.getElementById('privacy-agree');
                if (privacyCheck) {
                    privacyCheck.disabled = disabled;
                }

                submitButton.disabled = disabled;
                form.classList.toggle('is-submitted', disabled);
            };

            if (!form || !submitButton || !formMessage) {
                if (document.getElementById('contact-form')) console.warn("お問い合わせフォームに必要な要素が見つかりません。HTMLのIDを確認してください。");
            } else {

            // ----------------------------------------------------
            // フォーム送信処理 (API通信)
            // ----------------------------------------------------
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                
                // 値の取得
                const nameValue = document.getElementById('name').value.trim();
                const emailValue = document.getElementById('email').value.trim();
                const telValue = document.getElementById('tel').value.trim();
                const subjectValue = document.getElementById('subject').value;
                const messageValue = document.getElementById('message').value.trim();
                const privacyAgreeChecked = document.getElementById('privacy-agree').checked;

                // エラー表示をクリア
                allInputFields.forEach(id => {
                    document.getElementById(id)?.classList.remove('input-error');
                });
                const privacyLabel = document.querySelector('label[for="privacy-agree"]');
                if(privacyLabel) privacyLabel.classList.remove('input-error-label');
                formMessage.textContent = ''; 

                // ----------------------------------------------------
                // 1. フロントエンドでのバリデーション
                // ----------------------------------------------------
                const hasMissingField =
                    !nameValue ||
                    !emailValue ||
                    !telValue ||
                    !subjectValue ||
                    !messageValue ||
                    !privacyAgreeChecked;
                if (hasMissingField) {
                    formMessage.style.color = '#d9534f';
                    formMessage.textContent = '必須項目が未入力です。ご確認の上、再度送信してください。';
                    submitButton.textContent = '送信';
                    
                    // エラーマークの表示
                    if (!nameValue) document.getElementById('name').classList.add('input-error');
                    if (!emailValue) document.getElementById('email').classList.add('input-error');
                    if (!telValue) document.getElementById('tel').classList.add('input-error');
                    if (!subjectValue) document.getElementById('subject').classList.add('input-error');
                    if (!messageValue) document.getElementById('message').classList.add('input-error');
                    if (!privacyAgreeChecked) {
                        if(privacyLabel) privacyLabel.classList.add('input-error-label');
                    }
                    
                    setFormState(false);
                    return; 
                }
                
                // ----------------------------------------------------
                // 2. reCAPTCHA v3 トークンの取得（API通信の直前）
                // ----------------------------------------------------
                let recaptchaToken = '';
                setFormState(true); 
                submitButton.textContent = '認証中...';

                try {
                    // grecaptcha.execute はグローバルスコープで利用可能です
                    recaptchaToken = await grecaptcha.execute(recaptchaSiteKey, { action: 'contact_submit' });
                } catch (err) {
                    console.error("reCAPTCHA トークン取得エラー:", err);
                    formMessage.style.color = '#d9534f';
                    formMessage.textContent = 'セキュリティチェックに失敗しました。時間をおいて再度お試しください。';
                    setFormState(false);
                    submitButton.textContent = '送信';
                    return;
                }

                // ----------------------------------------------------
                // 3. APIへのデータ送信準備
                // ----------------------------------------------------
                
                submitButton.textContent = '送信中...'; // トークン取得後に送信中に変更
                
                const formData = {
                    name: nameValue,
                    email: emailValue,
                    tel: telValue,
                    subject: subjectValue,
                    message: messageValue,
                    privacy_agree: privacyAgreeChecked,
                    // 🌟 reCAPTCHA トークンを追加 🌟
                    recaptchaToken: recaptchaToken 
                };

                // ----------------------------------------------------
                // 4. API通信 (Fetch API)
                // ----------------------------------------------------
                try {
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                    
                    const result = await response.json(); 

                    if (response.ok) {

                        formMessage.textContent = '';

                        if (successModal) {
                            successModal.hidden = false;
                        }

                        // GA4キーイベント: 問い合わせフォーム送信成功
                        if (typeof gtag === 'function') {
                            gtag('event', 'generate_lead', {
                                form_name: 'contact_form'
                            });
                        }
                    } else {
                        // ❌ バックエンドからのエラー (4xx, 5xx)
                        
                        formMessage.style.color = '#d9534f';
                        submitButton.textContent = '送信';
                        setFormState(false); // フォームを有効化に戻す

                        if (result.error) {
                            // Lambdaで定義したエラーメッセージを表示
                            formMessage.textContent = result.error;
                        } else {
                            // Lambdaの予期せぬエラー (500など)
                            formMessage.textContent = 'システムエラーが発生しました。時間を置いて再度お試しください。';
                        }
                    }

                } catch (error) {
                    // 🚨 通信エラー (ネットワーク、CORS、タイムアウトなど)
                    console.error('Submission Error:', error);
                    
                    formMessage.style.color = '#d9534f';
                    formMessage.innerHTML = '通信エラーが発生しました。しばらく経ってから再度お試しください。<br>または、info@nex-link.jp宛に直接メールいただくようにお願いします。';
                    
                    submitButton.textContent = '送信';
                    setFormState(false); // フォームを有効化に戻す
                }
            });

            } // end of if (form && submitButton && formMessage)

            // =========================================================
            // 共通UI（リニューアル版）
            // =========================================================

            // ヘッダー：スクロールで下線を表示
            const hd = document.querySelector('.hd');
            const onScrollHd = () => { if (hd) hd.classList.toggle('scrolled', window.scrollY > 8); };
            window.addEventListener('scroll', onScrollHd, { passive: true });
            onScrollHd();

            // ヘッダー：スマホ用メニュー
            const menuBtn = document.getElementById('menu-btn');
            const menuPanel = document.getElementById('menu-panel');
            if (menuBtn && menuPanel) {
                menuBtn.addEventListener('click', () => {
                    const open = menuPanel.classList.toggle('open');
                    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
                });
                menuPanel.querySelectorAll('a[href^="#"], a[href*="#"]').forEach((a) => {
                    a.addEventListener('click', () => { menuPanel.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); });
                });
            }

            // トップページ：背景色が切り替わるセクション
            const tones = document.querySelectorAll('.tone');
            if (tones.length) {
                const updateTones = () => {
                    const vh = window.innerHeight || 800;
                    tones.forEach((el) => {
                        const r = el.getBoundingClientRect();
                        const on = r.top < vh * 0.62 && r.bottom > vh * 0.38;
                        el.classList.toggle('is-off', !on);
                    });
                };
                window.addEventListener('scroll', updateTones, { passive: true });
                window.addEventListener('resize', updateTones);
                updateTones();
            }

            // ニュース／沿革の開閉
            const bindToggle = (btnId, listId, openText, closeText) => {
                const btn = document.getElementById(btnId);
                const list = document.getElementById(listId);
                if (!btn || !list) return;
                btn.addEventListener('click', () => {
                    const expanded = list.classList.toggle('is-expanded');
                    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                    btn.textContent = expanded ? closeText : openText;
                });
            };
            bindToggle('news-toggle', 'news-list', '過去のニュースを見る', '閉じる');
            bindToggle('show-more-btn', 'hist-list', '過去の沿革を見る', '閉じる');

            // 会社概要：Googleマップ
            const mapContainer = document.getElementById('company-map-embed');
            if (mapContainer) {
                // 麹町秋山ビルディング（Googleマップで確認した座標。ピンが立つ）
                const address = '35.6843458,139.7336171';
                const iframe = document.createElement('iframe');
                iframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(address) + '&hl=ja&z=17&ie=UTF8&iwloc=B&output=embed';
                iframe.title = '株式会社NEXLINK 所在地の地図';
                iframe.loading = 'lazy';
                iframe.allowFullscreen = true;
                mapContainer.appendChild(iframe);
                // 座標指定の埋め込みには「マップで開く」が出ないため、リンクを自前で設置
                const mapLink = document.createElement('a');
                mapLink.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('麹町秋山ビルディング');
                mapLink.target = '_blank';
                mapLink.rel = 'noopener';
                mapLink.textContent = 'Googleマップで開く ↗';
                mapLink.style.cssText = 'display:inline-block;margin-top:12px;font-size:13px;letter-spacing:.06em;color:#16548A;text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px;';
                mapContainer.parentNode.appendChild(mapLink);
            }

            // GA4キーイベント：電話番号タップ
            document.querySelectorAll('a[href^="tel:"]').forEach((telLink) => {
                telLink.addEventListener('click', () => {
                    if (typeof gtag === 'function') {
                        gtag('event', 'phone_click', { phone_number: telLink.getAttribute('href').replace('tel:', '') });
                    }
                });
            });

            // 画像ライトボックス（ISO9001証書）
            const lightbox = document.getElementById('img-lightbox');
            const lightboxImage = document.getElementById('img-lightbox-image');
            const lightboxClose = document.getElementById('img-lightbox-close');
            if (lightbox && lightboxImage) {
                const closeLightbox = () => { lightbox.hidden = true; lightboxImage.src = ''; };
                document.querySelectorAll('.zoomable-img').forEach((img) => {
                    img.addEventListener('click', () => {
                        lightboxImage.src = img.currentSrc || img.src;
                        lightboxImage.alt = img.alt || '';
                        lightbox.hidden = false;
                    });
                });
                if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
                lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
                document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });
            }
        });
