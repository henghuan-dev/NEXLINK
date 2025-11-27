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
        // JavaScript for Form Submission (script.js) - UXテスト用修正
        // =========================================================

        // 🌟 API GatewayのエンドポイントURLを設定 🌟
        const API_ENDPOINT = 'https://0rn89v3rzk.execute-api.ap-northeast-1.amazonaws.com/prod/contact'; 
        // 🌟 フォーム送信後の遷移先URLを設定 🌟
        const SUCCESS_REDIRECT_URL = 'thanks.html'; // 完了画面のURLを設定

        document.addEventListener('DOMContentLoaded', () => {
            
            // フォーム要素の取得
            const form = document.getElementById('contact-form');
            const submitButton = document.getElementById('submit-button');
            const formMessage = document.getElementById('form-message');
            
            if (!form || !submitButton) return;
            
            // --- (スクロール処理、ハンバーガーメニューの処理は省略) ---

            // ----------------------------------------------------
            // お問い合わせフォーム送信処理 (UXテストモード)
            // ----------------------------------------------------
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); // デフォルトのフォーム送信を阻止

                formMessage.textContent = ''; 
                submitButton.disabled = true;
                submitButton.textContent = '送信中...';

                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                    privacy_agree: document.getElementById('privacy-agree').checked 
                };

                try {
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });

                    // 🌟 修正ポイント: APIの応答に関わらず、成功メッセージを表示
                    // const result = await response.json(); // API結果の取得はスキップ

                    formMessage.style.color = '#5cb85c'; // 緑色
                    formMessage.textContent = 'お問い合わせを受け付けました。ページを移動します...';

                    // フォーム送信成功とみなして、指定のページに遷移
                    setTimeout(() => {
                        window.location.href = SUCCESS_REDIRECT_URL; 
                    }, 1500); // 1.5秒後に遷移

                } catch (error) {
                    // ネットワークエラーなど、Fetch自体が失敗した場合のみ
                    console.error('Submission Error (Network or CORS issue):', error);
                    formMessage.style.color = '#d9534f';
                    formMessage.textContent = '通信エラーが発生しました。ネットワーク設定を確認してください。';
                    
                    submitButton.disabled = false;
                    submitButton.textContent = '上記内容で送信する';
                }
            });
        });