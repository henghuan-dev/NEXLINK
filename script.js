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
        // script.js - API通信組み込みバージョン
        // =========================================================

        // 🌟🌟🌟 API GatewayのエンドポイントURLを設定 🌟🌟🌟
        // 【重要】本番環境のAPI GatewayのURLに必ず置き換えてください。
        const API_ENDPOINT = 'https://0rn89v3rzk.execute-api.ap-northeast-1.amazonaws.com/prod/contact'; 

        document.addEventListener('DOMContentLoaded', () => {
            
            // フォーム要素の取得
            const form = document.getElementById('contact-form');
            const submitButton = document.getElementById('submit-button');
            const formMessage = document.getElementById('form-message');
            
            // 必須フィールドのIDリスト
            // (name, email, privacy-agreeのチェックボックス状態はJSのバリデーションで確認)
            const requiredFields = ['name', 'email'];
            const allInputFields = ['name', 'email', 'subject', 'message']; // グレーアウト対象

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
                console.warn("お問い合わせフォームに必要な要素が見つかりません。HTMLのIDを確認してください。");
                return;
            }


            // ----------------------------------------------------
            // フォーム送信処理 (API通信)
            // ----------------------------------------------------
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                
                // 値の取得
                const nameValue = document.getElementById('name').value.trim();
                const emailValue = document.getElementById('email').value.trim();
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
                const hasMissingField = !nameValue || !emailValue || !privacyAgreeChecked;

                if (hasMissingField) {
                    formMessage.style.color = '#d9534f';
                    formMessage.textContent = '必須項目が未入力です。ご確認の上、再度送信してください。';
                    submitButton.textContent = '送信';
                    
                    // エラーマークの表示
                    if (!nameValue) document.getElementById('name').classList.add('input-error');
                    if (!emailValue) document.getElementById('email').classList.add('input-error');
                    if (!privacyAgreeChecked) {
                        if(privacyLabel) privacyLabel.classList.add('input-error-label');
                    }
                    
                    setFormState(false);
                    return; 
                }

                // ----------------------------------------------------
                // 2. APIへのデータ送信準備
                // ----------------------------------------------------
                
                setFormState(true); 
                submitButton.textContent = '送信中...';
                
                const formData = {
                    name: nameValue,
                    email: emailValue,
                    // バックエンドのLambdaコードで subject を利用する場合は、ここに含める
                    subject: subjectValue, 
                    message: messageValue,
                    privacy_agree: privacyAgreeChecked
                };

                // ----------------------------------------------------
                // 3. API通信 (Fetch API)
                // ----------------------------------------------------
                try {
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            // 必要に応じて API Key や認証ヘッダーを追加
                        },
                        body: JSON.stringify(formData),
                    });
                    
                    // JSONレスポンスを待機 (Lambdaからのエラー情報を含む)
                    const result = await response.json(); 

                    if (response.ok) {
                        // ✅ 成功時の処理 (ステータスコード 200-299)
                        formMessage.style.color = '#1C479B'; // ダークブルー
                        formMessage.innerHTML = 'お問い合わせを受け付けました。<br>担当より３営業日以内にご連絡させていただきます。しばらくおまちください。';
                        submitButton.textContent = '送信完了';
                        // フォームはグレーアウト状態を維持 (setFormState(true)で処理済み)

                    } else {
                        // ❌ バックエンドからのエラー (4xx, 5xx)
                        
                        formMessage.style.color = '#d9534f';
                        submitButton.textContent = '送信';
                        setFormState(false); // フォームを有効化に戻す

                        if (result.error) {
                            // Lambdaで定義したエラーメッセージを表示
                            formMessage.textContent = result.error;

                            // Lambdaからのエラー情報に基づき、エラーマークを再表示するロジックをここに追加
                            // 例: if (result.error.includes('メールアドレス')) document.getElementById('email').classList.add('input-error');

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