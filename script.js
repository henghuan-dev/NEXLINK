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
        // script.js - 株式会社NEXLINK (HTML構造に適合済み・純粋モックモード)
        // =========================================================

        document.addEventListener('DOMContentLoaded', () => {
            
            // フォーム要素の取得
            const form = document.getElementById('contact-form');
            const submitButton = document.getElementById('submit-button'); // HTMLにIDを追加
            const formMessage = document.getElementById('form-message');   // HTMLにIDを追加
            
            // 必須フィールドのIDリスト (messageはrequiredがないため、HTML側で必須とするならここに追加)
            const requiredFields = ['name', 'email'];
            
            // ----------------------------------------------------
            // フォームの入力状態を制御する関数
            // ----------------------------------------------------
            const setFormState = (disabled) => {
                // 必須・任意入力フィールド
                const inputFields = ['name', 'email', 'subject', 'message']; 
                
                inputFields.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.disabled = disabled;
                    }
                });
                
                // プライバシーチェックボックス
                const privacyCheck = document.getElementById('privacy-agree');
                if (privacyCheck) {
                    privacyCheck.disabled = disabled;
                }

                submitButton.disabled = disabled;
                // disabled状態に応じてフォーム全体にクラスを付ける（CSSで見た目を制御）
                form.classList.toggle('is-submitted', disabled);
            };

            if (!form || !submitButton || !formMessage) {
                console.warn("お問い合わせフォームに必要な要素が見つかりません。HTMLのIDを確認してください。");
                return; // 要素がなければ処理を終了
            }


            // ----------------------------------------------------
            // フォーム送信処理 (API通信なしの純粋モック)
            // ----------------------------------------------------
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                
                // 値の取得
                const nameValue = document.getElementById('name').value.trim();
                const emailValue = document.getElementById('email').value.trim();
                // messageValueはHTMLでrequiredではないため、ここでは必須としない
                const privacyAgreeChecked = document.getElementById('privacy-agree').checked;

                // エラー表示をクリア
                requiredFields.forEach(id => {
                    document.getElementById(id)?.classList.remove('input-error');
                });
                const privacyLabel = document.querySelector('label[for="privacy-agree"]');
                if(privacyLabel) privacyLabel.classList.remove('input-error-label');
                formMessage.textContent = ''; 

                // ----------------------------------------------------
                // 1. フロントエンドでのバリデーション (必須チェック: 会社名/氏名, メールアドレス, 同意)
                // ----------------------------------------------------
                const hasMissingField = !nameValue || !emailValue || !privacyAgreeChecked;

                if (hasMissingField) {
                    // 🚨 バリデーションエラー発生
                    formMessage.style.color = '#d9534f';
                    formMessage.textContent = '必須項目が未入力です。ご確認の上、再度送信してください。';
                    submitButton.textContent = '送信';
                    
                    // エラーマークの表示
                    if (!nameValue) document.getElementById('name').classList.add('input-error');
                    if (!emailValue) document.getElementById('email').classList.add('input-error');
                    if (!privacyAgreeChecked) {
                        if(privacyLabel) privacyLabel.classList.add('input-error-label');
                    }
                    
                    setFormState(false); // フォームは編集可能なまま
                    return; 
                }

                // ----------------------------------------------------
                // 2. 送信成功シミュレーション
                // ----------------------------------------------------
                
                setFormState(true); 
                submitButton.textContent = '送信中...';

                // 擬似的な通信遅延 (1.5秒)
                setTimeout(() => {
                    // ✅ 送信成功UIの表示
                    formMessage.style.color = '#5cb85c';
                    formMessage.innerHTML = 'お問い合わせを受け付けました。<br>担当より３営業日以内にご連絡させていただきます。しばらくおまちください。';
                    submitButton.textContent = '送信完了';
                    
                }, 1500);
            });

            // =========================================================
            // サイト共通機能 (変更なし)
            // =========================================================

            // ----------------------------------------------------
            // スクロール処理 (Top Barのスタイル変更)
            // ----------------------------------------------------
            const topBar = document.querySelector('.top-bar');
            const scrollThreshold = 50; 

            window.addEventListener('scroll', () => {
                if (topBar) {
                    if (window.scrollY > scrollThreshold) {
                        topBar.classList.add('scrolled');
                    } else {
                        topBar.classList.remove('scrolled');
                    }
                }
            });

            // ----------------------------------------------------
            // ハンバーガーメニュー (モバイルナビゲーション)
            // ----------------------------------------------------
            const hamburger = document.getElementById('hamburger-icon');
            const drawer = document.getElementById('mobile-drawer');
            const navLinks = drawer ? drawer.querySelectorAll('.nav-link') : []; 

            if (hamburger && drawer) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('open');
                    drawer.classList.toggle('open');
                });
                
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        if (drawer.classList.contains('open')) {
                            hamburger.classList.remove('open');
                            drawer.classList.remove('open');
                        }
                    });
                });
            }
        });