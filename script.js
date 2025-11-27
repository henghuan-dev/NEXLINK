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

        // フォーム送信処理 (モック/本番切り替え)
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            formMessage.textContent = ''; 
            
            // 必須フィールドの値を取得
            const nameValue = document.getElementById('name').value.trim();
            const emailValue = document.getElementById('email').value.trim();
            const messageValue = document.getElementById('message').value.trim();
            const privacyAgreeChecked = document.getElementById('privacy-agree').checked;

            // フィールドエラーをクリア
            formFields.forEach(id => {
                document.getElementById(id)?.classList.remove('input-error');
            });
            const privacyLabel = document.querySelector('label[for="privacy-agree"]');
            if(privacyLabel) privacyLabel.classList.remove('input-error-label');
            
            setFormState(true); // 送信開始時に全て無効化
            submitButton.textContent = '送信中...';

            const formData = {
                name: nameValue,
                email: emailValue,
                message: messageValue,
                privacy_agree: privacyAgreeChecked
            };

            // ----------------------------------------------------
            // 🌟 モックモードの場合 🌟
            // ----------------------------------------------------
            if (IS_MOCK_MODE) {
                
                // 💡 モック応答の切り替えロジック
                const simulateValidationFailure = !nameValue || !emailValue || !messageValue || !privacyAgreeChecked;
                const simulateCommunicationError = nameValue.includes('通信エラー');

                setTimeout(() => {
                    
                    if (simulateCommunicationError) {
                        // 通信エラーのUI確認
                        formMessage.style.color = '#d9534f';
                        formMessage.innerHTML = '通信エラーが発生しました。しばらく経ってから再度お試しください。<br>または、info@nex-link.jp宛に直接メールいただくようにお願いします。';
                        
                        submitButton.textContent = '上記内容で送信する';
                        setFormState(false); 
                        
                    } else if (simulateValidationFailure) {
                        // バリデーションエラーのUI確認
                        formMessage.style.color = '#d9534f';
                        submitButton.textContent = '上記内容で送信する';
                        setFormState(false); 

                        formMessage.textContent = '入力内容に誤りがあります。未記入の項目をご確認ください。';
                        if (!nameValue) document.getElementById('name').classList.add('input-error');
                        if (!emailValue) document.getElementById('email').classList.add('input-error');
                        if (!messageValue) document.getElementById('message').classList.add('input-error');
                        if (!privacyAgreeChecked) {
                            if(privacyLabel) privacyLabel.classList.add('input-error-label');
                        }
                        
                    } else {
                        // 送信成功のUI確認
                        formMessage.style.color = '#5cb85c';
                        formMessage.innerHTML = 'お問い合わせを受け付けました。<br>担当より３営業日以内にご連絡させていただきます。しばらくおまちください。';
                        submitButton.textContent = '送信完了';
                    }
                    
                }, 1500); // 擬似的な通信遅延

            // ----------------------------------------------------
            // 🚀 本番モードの場合 (IS_MOCK_MODE = false) 🌟
            // ----------------------------------------------------
            } else {
                try {
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                    });
                    
                    const result = await response.json();

                    if (response.ok) {
                        // 成功時の処理
                        formMessage.style.color = '#5cb85c';
                        formMessage.innerHTML = 'お問い合わせを受け付けました。<br>担当より３営業日以内にご連絡させていただきます。しばらくおまちください。';
                        submitButton.textContent = '送信完了';

                    } else {
                        // Lambdaからのエラー（バリデーションなど）
                        formMessage.style.color = '#d9534f';
                        submitButton.textContent = '上記内容で送信する';
                        setFormState(false); 

                        // バリデーションエラー処理（Lambdaコードからのエラーメッセージに依存）
                        if (result.error && result.error.includes('必須項目が不足しています')) {
                            formMessage.textContent = '入力内容に誤りがあります。未記入の項目をご確認ください。';
                            
                            // エラー項目にマークを付ける処理（Lambdaが返すエラーメッセージに依存）
                            if (result.error.includes('お名前')) document.getElementById('name').classList.add('input-error');
                            if (result.error.includes('メールアドレス')) document.getElementById('email').classList.add('input-error');
                            if (result.error.includes('お問い合わせ内容')) document.getElementById('message').classList.add('input-error');
                            // ... (プライバシーポリシー同意チェックも同様)
                        
                        } else {
                            formMessage.textContent = result.error || 'エラーが発生しました。入力内容を確認してください。';
                        }
                    }

                } catch (error) {
                    // 通信エラー（403/CORS/ネットワークダウンなど）
                    console.error('Submission Error:', error);
                    formMessage.style.color = '#d9534f';
                    formMessage.innerHTML = '通信エラーが発生しました。しばらく経ってから再度お試しください。<br>または、info@nex-link.jp宛に直接メールいただくようにお願いします。';
                    
                    submitButton.textContent = '上記内容で送信する';
                    setFormState(false); 
                }
            }
        });