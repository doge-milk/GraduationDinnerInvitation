/**
 * H5版本JavaScript文件
 * 实现页面切换、用户输入处理、数据存储、分享和下载功能
 */

class InvitationApp {
    constructor() {
        this.playerName = '';
        this.currentPage = 'enterPage';
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkStoredName();
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 输入框事件
        const playerNameInput = document.getElementById('playerNameInput');
        const confirmBtn = document.getElementById('confirmBtn');
        
        playerNameInput.addEventListener('input', (e) => {
            this.onInputChange(e);
        });
        
        playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.playerName.trim()) {
                this.confirmAndNavigate();
            }
        });
        
        confirmBtn.addEventListener('click', () => {
            this.confirmAndNavigate();
        });
        
        // 分享和下载按钮
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareInvitation();
        });
        
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadInvitation();
        });
    }

    /**
     * 检查本地存储的亲朋好友名称
     */
    checkStoredName() {
        const storedName = localStorage.getItem('playerName');
        if (storedName) {
            this.playerName = storedName;
            document.getElementById('playerNameInput').value = storedName;
            document.getElementById('confirmBtn').disabled = false;
            // 如果已有名称，可以选择直接跳转到邀请函页面
            // this.showPage('invitationPage');
            // this.updateInvitationDisplay();
        }
    }

    /**
     * 输入框内容变化处理
     */
    onInputChange(e) {
        this.playerName = e.target.value.trim();
        const confirmBtn = document.getElementById('confirmBtn');
        confirmBtn.disabled = !this.playerName;
    }

    /**
     * 确认并导航到转场页面
     */
    confirmAndNavigate() {
        if (!this.playerName) {
            this.showToast('请输入亲朋好友名称');
            return;
        }

        // 保存到本地存储
        localStorage.setItem('playerName', this.playerName);
        
        // 显示转场页面
        this.showPage('transitionPage');
        
        // 2秒后跳转到邀请函页面
        setTimeout(() => {
            this.showPage('invitationPage');
            this.updateInvitationDisplay();
        }, 2000);
    }

    /**
     * 显示指定页面
     */
    showPage(pageId) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示目标页面
        document.getElementById(pageId).classList.add('active');
        this.currentPage = pageId;
    }

    /**
     * 更新邀请函显示
     */
    updateInvitationDisplay() {
        const displayElement = document.getElementById('displayPlayerName');
        displayElement.textContent = this.playerName || '尊贵的亲朋好友';
    }

    /**
     * 显示提示信息
     */
    showToast(message, duration = 2000) {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 9999;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        // 添加动画样式
        if (!document.querySelector('#toastStyle')) {
            const style = document.createElement('style');
            style.id = 'toastStyle';
            style.textContent = `
                @keyframes fadeInOut {
                    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // 自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);
    }

    /**
     * 分享邀请函
     */
    shareInvitation() {
        const userName = this.playerName || '尊贵的亲朋好友';
        const shareData = {
            title: `${userName}邀请您参加升学宴`,
            text: `${userName}诚挚邀请您参加升学宴，时间：2025年8月16日 11:30`,
            url: window.location.href
        };

        if (navigator.share) {
            // 使用Web Share API（移动设备支持）
            navigator.share(shareData)
                .then(() => {
                    this.showToast('分享成功！');
                })
                .catch((error) => {
                    console.log('分享失败:', error);
                    this.fallbackShare(shareData);
                });
        } else {
            // 降级处理
            this.fallbackShare(shareData);
        }
    }

    /**
     * 降级分享处理
     */
    fallbackShare(shareData) {
        // 复制链接到剪贴板
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    this.showToast('链接已复制到剪贴板！');
                })
                .catch(() => {
                    this.showShareModal(shareData);
                });
        } else {
            this.showShareModal(shareData);
        }
    }

    /**
     * 显示分享模态框
     */
    showShareModal(shareData) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 90%;
                text-align: center;
                color: black;
            ">
                <h3 style="margin-bottom: 15px; color: #ffe60aff;">${shareData.title}</h3>
                <p style="margin-bottom: 20px; font-size: 14px;">${shareData.text}</p>
                <div style="margin-bottom: 20px;">
                    <input type="text" value="${shareData.url}" readonly style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        font-size: 12px;
                    ">
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #e31c1cff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">关闭</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * 下载邀请函图片
     */
    async downloadInvitation() {
        try {
            this.showToast('正在生成图片...');
            
            // 创建临时canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 设置高分辨率画布
            const scale = 3;
            canvas.width = 600 * scale;
            canvas.height = 900 * scale;
            ctx.scale(scale, scale);
            
            // 绘制背景
            const gradient = ctx.createLinearGradient(0, 0, 0, 900);
            gradient.addColorStop(0, '#1a1a1a');
            gradient.addColorStop(1, '#000000');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 600, 900);
            
            // 绘制边框装饰
            ctx.strokeStyle = '#E31C77';
            ctx.lineWidth = 3;
            ctx.strokeRect(30, 30, 540, 840);
            
            // 绘制内边框
            ctx.strokeStyle = 'rgba(227, 28, 119, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(50, 50, 500, 800);
            
            // 绘制标题
            ctx.fillStyle = '#ffe60aff';
            ctx.font = 'bold 42px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('升学宴邀请函', 300, 140);
            
            // 绘制副标题
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '24px Arial, sans-serif';
            ctx.fillText('Invitation', 300, 180);
            
            // 绘制亲朋好友名称
            ctx.fillStyle = '#ffe60aff';
            ctx.font = 'bold 36px Arial, sans-serif';
            ctx.fillText(this.playerName || '尊贵的亲朋好友', 300, 240);
            
            // 绘制装饰线
            ctx.strokeStyle = '#E31C77';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(200, 260);
            ctx.lineTo(400, 260);
            ctx.stroke();
            
            // 绘制邀请内容
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '24px Arial, sans-serif';
            ctx.fillText('诚挚邀请您参加', 300, 320);
            
            // 绘制活动名称
            ctx.fillStyle = '#ffe60aff';
            ctx.font = 'bold 48px Arial, sans-serif';
            ctx.fillText('升学宴', 300, 370);
            
            // 绘制日期时间
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '22px Arial, 楷体';
            ctx.fillText('2025年8月16日 （周六）', 300, 420);
            ctx.fillText('农历六月廿三', 300, 450);
            ctx.fillText('上午11:30', 300, 480);

            // 绘制地点
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 26px Arial, 黑体';
            ctx.textAlign = 'center';
            ctx.fillText('地点:斜桥小虎酒楼一楼大厅"', 300, 720);
            
            // 绘制底部装饰
            ctx.strokeStyle = 'rgba(227, 28, 119, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(150, 760);
            ctx.lineTo(450, 760);
            ctx.stroke();
            
            // 绘制底部文字
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '18px Arial, sans-serif';
            ctx.fillText('期待您的到来', 300, 800);
            
            // 绘制小装饰点
            ctx.fillStyle = '#E31C77';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(250 + i * 25, 830, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
            
            // 下载图片
            const link = document.createElement('a');
            link.download = `${this.playerName || '亲朋好友'}_邀请函.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            
            this.showToast('邀请函已下载！');
            
        } catch (error) {
            console.error('生成图片失败:', error);
            this.showToast('生成图片失败，请重试');
        }
    }

    /**
     * 重置应用状态
     */
    reset() {
        localStorage.removeItem('playerName');
        this.playerName = '';
        document.getElementById('playerNameInput').value = '';
        document.getElementById('confirmBtn').disabled = true;
        this.showPage('enterPage');
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.invitationApp = new InvitationApp();
    
    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        // ESC键返回首页
        if (e.key === 'Escape') {
            window.invitationApp.reset();
        }
    });
    
    // 防止页面缩放
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});
