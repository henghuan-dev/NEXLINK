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
        // JavaScript for Form Submission (script.js) - 純粋モックモード
        // 目的: フォームの動的なUI動作（バリデーションと成功時の表示）のテスト
        // =========================================================

        // ... (他のスクロール、ハンバーガーメニューの処理はそのまま残してください) ...

        // フォームの入力状態を制御する関数 (変更なし)
        const setFormState = (disabled) => {
            // ... (setFormState関数の定義は前回の完全版コードと同じものを残してください) ...
            const form = document.getElementById('contact-form');
            const submitButton = document.getElementById('submit-button');
            const formFields = ['name', 'email', 'message']; // IDリストは適宜調整
            
            formFields.forEach(id => {
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


        // ----------------------------------------------------
        // フォーム送信処理 (API通信なしの純粋モック)
        // ----------------------------------------------------
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const formMessage = document.getElementById('form-message');
            const submitButton = document.getElementById('submit-button');
            
            // 必須フィールドの値を取得
            const nameValue = document.getElementById('name').value.trim();
            const emailValue = document.getElementById('email').value.trim();
            const messageValue = document.getElementById('message').value.trim();
            const privacyAgreeChecked = document.getElementById('privacy-agree').checked;

            // フィールドエラーをクリア
            const formFields = ['name', 'email', 'message'];
            formFields.forEach(id => {
                document.getElementById(id)?.classList.remove('input-error');
            });
            const privacyLabel = document.querySelector('label[for="privacy-agree"]');
            if(privacyLabel) privacyLabel.classList.remove('input-error-label');
            formMessage.textContent = ''; 

            // ----------------------------------------------------
            // 1. フロントエンドでのバリデーション (必須チェック)
            // ----------------------------------------------------
            const hasMissingField = !nameValue || !emailValue || !messageValue || !privacyAgreeChecked;

            if (hasMissingField) {
                // 🚨 バリデーションエラー発生
                formMessage.style.color = '#d9534f';
                formMessage.textContent = '入力内容に誤りがあります。未記入の項目をご確認ください。';
                submitButton.textContent = '上記内容で送信する';
                
                // エラーマークの表示
                if (!nameValue) document.getElementById('name').classList.add('input-error');
                if (!emailValue) document.getElementById('email').classList.add('input-error');
                if (!messageValue) document.getElementById('message').classList.add('input-error');
                if (!privacyAgreeChecked) {
                    if(privacyLabel) privacyLabel.classList.add('input-error-label');
                }
                
                // フォームは編集可能なまま
                setFormState(false); 
                
                return; // 処理を終了
            }

            // ----------------------------------------------------
            // 2. 送信成功シミュレーション
            // ----------------------------------------------------
            
            // UIを「送信中」状態にする
            setFormState(true); 
            submitButton.textContent = '送信中...';

            // 擬似的な通信遅延 (1.5秒)
            setTimeout(() => {
                // ✅ 送信成功UIの表示
                formMessage.style.color = '#5cb85c';
                formMessage.innerHTML = 'お問い合わせを受け付けました。<br>担当より３営業日以内にご連絡させていただきます。しばらくおまちください。';
                
                // フォームはグレーアウト（setFormState(true)で既に処理済み）
                submitButton.textContent = '送信完了';
                
            }, 1500);
        });