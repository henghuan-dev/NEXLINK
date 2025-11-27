(function() {
            const processStepsContainer = document.getElementById('process-steps');
            const processCurrent = document.getElementById('process-current');
            const steps = processStepsContainer ? processStepsContainer.querySelectorAll('.step') : [];
            const labels = ['企画', '試作', '生産', '納品'];
            let currentStep = 1;
            let processInterval = null;
            
            if (steps.length > 0) {
                const updateProcess = () => {
                    steps.forEach((step, index) => {
                        step.classList.toggle('active', index < currentStep);
                    });
                    // 新しいラベルに対応させる
                    if (processCurrent) {
                        processCurrent.textContent = `進捗：${labels[currentStep-1]}`;
                    }
                    currentStep++;
                    if (currentStep > steps.length) {
                        currentStep = 1; 
                    }
                };
                
                const aboutSection = document.getElementById('about');
                const io = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (!processInterval) {
                                updateProcess(); 
                                processInterval = setInterval(updateProcess, 1500); 
                            }
                        } else {
                            if (processInterval) {
                                clearInterval(processInterval);
                                processInterval = null;
                            }
                        }
                    });
                }, { threshold: 0.4 }); 
                
                io.observe(aboutSection);
            }

            // Stealth Navigation Logic 
            const topBar = document.querySelector('.top-bar');
            const scrollThreshold = 100;

            window.addEventListener('scroll', () => {
                if (window.scrollY > scrollThreshold) {
                    topBar.classList.add('scrolled');
                } else {
                    topBar.classList.remove('scrolled');
                }
            });
            
            if (window.scrollY > scrollThreshold) {
                topBar.classList.add('scrolled');
            }

            // Smooth Scroll and Drawer Close Logic 
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    
                    const drawer = document.getElementById('mobile-drawer');
                    const hamburger = document.getElementById('hamburger-icon');
                    if (drawer && drawer.classList.contains('open')) {
                        drawer.classList.remove('open');
                        hamburger.classList.remove('open');
                        document.body.style.overflow = 'auto'; 
                    }

                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const topBarHeight = topBar.offsetHeight || 0; 
                        const offsetPosition = targetElement.offsetTop - topBarHeight;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Hamburger Menu Logic 
            const hamburgerIcon = document.getElementById('hamburger-icon');
            const mobileDrawer = document.getElementById('mobile-drawer');

            if (hamburgerIcon && mobileDrawer) {
                hamburgerIcon.addEventListener('click', () => {
                    const isOpen = mobileDrawer.classList.toggle('open');
                    hamburgerIcon.classList.toggle('open', isOpen);
                    document.body.style.overflow = isOpen ? 'hidden' : 'auto'; 
                });
            }

            // Google Map Placeholder 
            const mapContainer = document.getElementById('company-map-embed');
            const address = '東京都千代田区麹町五丁目３番４丁目 麹町秋山ビルディング 8F';
            
            if (mapContainer) {
                const mapIframe = document.createElement('iframe');
                mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=B&output=embed`;
                mapIframe.allowFullscreen = true;
                mapIframe.loading = 'lazy';
                
                mapContainer.appendChild(mapIframe);
                
                mapContainer.addEventListener('click', () => {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
                });
                
                mapContainer.style.cursor = 'pointer';
            }
        })();

        // =========================================================
        // JavaScript for Form Submission (script.js) - ページ内完結・UX要件対応
        // =========================================================

        // 🌟 API GatewayのエンドポイントURLを設定 🌟
        const API_ENDPOINT = 'https://0rn89v3rzk.execute-api.ap-northeast-1.amazonaws.com/prod/contact'; 

        document.addEventListener('DOMContentLoaded', () => {
            
            const form = document.getElementById('contact-form');
            const submitButton = document.getElementById('submit-button');
            const formMessage = document.getElementById('form-message');
            const formFields = ['name', 'email', 'message', 'privacy-agree'];

            if (!form || !submitButton) return;
            
            // --- (スクロール処理、ハンバーガーメニューの処理は省略) ---

            // フォームの入力状態を制御する関数
            const setFormState = (disabled) => {
                formFields.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.disabled = disabled;
                        // disabled状態に応じてフォーム全体にクラスを付ける（CSSで見た目を制御）
                        form.classList.toggle('is-submitted', disabled);
                    }
                });
                submitButton.disabled = disabled;
            };

            // フォーム送信処理
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                formMessage.textContent = ''; 
                setFormState(true); // 送信開始時に全て無効化
                submitButton.textContent = '送信中...';

                // フィールドエラーをクリア
                formFields.forEach(id => {
                    document.getElementById(id)?.classList.remove('input-error');
                });
                
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                    privacy_agree: document.getElementById('privacy-agree').checked 
                };

                try {
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                    });
                    
                    const result = await response.json();

                    if (response.ok) {
                        // 1. 🌟 送信成功時の処理 🌟
                        formMessage.style.color = '#5cb85c';
                        formMessage.innerHTML = 'お問い合わせを受け付けました。<br>担当より３営業日以内にご連絡させていただきます。しばらくおまちください。';
                        
                        // フォームはグレーアウト（setFormState(true)で既に処理済み）
                        submitButton.textContent = '送信完了';

                    } else {
                        // 2. 🌟 送信失敗時（Lambdaからのエラー）の処理 🌟
                        
                        formMessage.style.color = '#d9534f';
                        submitButton.textContent = '上記内容で送信する';
                        setFormState(false); // フォームを有効化に戻す

                        if (result.error && result.error.includes('必須項目が不足しています')) {
                            // 2-1. 未記入欄があった場合
                            formMessage.textContent = '入力内容に誤りがあります。未記入の項目をご確認ください。';
                            
                            // エラーメッセージから不足項目を抽出してマークを付ける
                            if (result.error.includes('お名前')) document.getElementById('name').classList.add('input-error');
                            if (result.error.includes('メールアドレス')) document.getElementById('email').classList.add('input-error');
                            if (result.error.includes('お問い合わせ内容')) document.getElementById('message').classList.add('input-error');
                            if (result.error.includes('プライバシーポリシー同意')) document.getElementById('privacy-agree').classList.add('input-error');
                        
                        } else {
                            // 2-2. その他のエラー（形式不正、文字数超過など）
                            formMessage.textContent = result.error || 'エラーが発生しました。入力内容を確認してください。';
                        }
                    }

                } catch (error) {
                    // 3. 🌟 通信エラー（ネットワーク、CORS、403など）の処理 🌟
                    console.error('Submission Error:', error);
                    formMessage.style.color = '#d9534f';
                    formMessage.innerHTML = '通信エラーが発生しました。しばらく経ってから再度お試しください。または、info@nex-link.jp宛に直接メールいただくようにお願いします。';
                    
                    submitButton.textContent = '上記内容で送信する';
                    setFormState(false); // フォームを有効化に戻す
                }
            });
            
            // ページリロード時にフォームをリセットする（リロードで通常表示に戻る要件）
            // 実際には、ページをリロードすれば自動的にフォームは有効な状態に戻ります。
        });