document.addEventListener('DOMContentLoaded', () => {
    const scrollDot = document.getElementById('scroll-dot');
    const dotTargets = document.querySelectorAll('.dot-target');
    const importantSection = document.getElementById('section-important');
    const stopWrapper = document.querySelector('.stop-image-wrapper');

    let targetPositions = [];

    // 1. 타겟 위치 계산 (화면 리사이즈 시 재계산)
    const updateLayout = () => {
        targetPositions = [];
        // 문서 전체에서의 스크롤 위치
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        dotTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            // 타겟의 절대 좌표 계산
            const absoluteY = rect.top + scrollY + rect.height / 2;
            const absoluteX = rect.left + window.scrollX + rect.width / 2;

            targetPositions.push({
                id: target.dataset.targetId,
                x: absoluteX,
                y: absoluteY,
                element: target 
            });
        });
        
        // Y좌표 순으로 정렬
        targetPositions.sort((a, b) => a.y - b.y);
    };

    // 2. 동그라미 스타일 업데이트 함수
    const updateDotStyle = (id) => {
        scrollDot.className = ''; 
        scrollDot.id = 'scroll-dot'; 
        scrollDot.style.border = ''; 

        switch (id) {
            case 'important-text': 
                scrollDot.classList.add('dot', 'is-important-text');
                break;
            case 'heart':
                scrollDot.classList.add('dot', 'is-heart');
                break;
            case 'ok':
                scrollDot.classList.add('dot', 'is-ok');
                break;
            case 'tap':
                scrollDot.classList.add('dot', 'is-tap');
                break;
            case 'rec':
                scrollDot.classList.add('dot', 'is-rec');
                break;
            case 'chat':
                scrollDot.classList.add('dot', 'is-badge');
                break;
            case 'player':
                scrollDot.classList.add('dot', 'is-square');
                break;
            case 'snowman':
                scrollDot.classList.add('dot', 'is-white');
                break;
            case 'exclamation':
                scrollDot.classList.add('dot', 'is-exclamation');
                break;
            default: 
                scrollDot.classList.add('dot');
                break;
        }
    };

    // 3. 메인 스크롤 핸들러
    const handleScroll = () => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        // 현재 화면의 정중앙 좌표
        const viewportCenterY = scrollY + (viewportHeight / 2);

        // [자동차 등장 애니메이션] 화면 하단에 걸치면 등장
        if (stopWrapper) {
            const wrapperTop = stopWrapper.closest('section').offsetTop;
            if (scrollY + viewportHeight > wrapperTop + 200) {
                stopWrapper.classList.add('active');
            }
        }
        
        // [메인 화면 숨김 처리]
        // 타겟이 없거나, 첫 번째 타겟(자동차)보다 훨씬 위에 있으면 숨김
        if (targetPositions.length === 0 || viewportCenterY < targetPositions[0].y - viewportHeight * 0.4) {
            scrollDot.style.opacity = '0';
            return; 
        } else {
            scrollDot.style.opacity = '1';
        }

        // [현재 활성 타겟 찾기] 화면 중앙과 가장 가까운 타겟을 찾음
        let closestTarget = null;
        let minDiff = Infinity;

        targetPositions.forEach(pos => {
            const diff = Math.abs(viewportCenterY - pos.y);
            if (diff < minDiff) {
                minDiff = diff;
                closestTarget = pos;
            }
        });

        // [부드러운 이동 계산] 현재 구간 찾기
        let currentIdx = 0;
        for (let i = 0; i < targetPositions.length - 1; i++) {
            if (viewportCenterY >= targetPositions[i].y) {
                currentIdx = i;
            }
        }
        
        const currentTarget = targetPositions[currentIdx];
        const nextTarget = targetPositions[currentIdx + 1];

        let finalX = currentTarget.x;
        let finalY = currentTarget.y;

        if (nextTarget) {
            const distTotal = nextTarget.y - currentTarget.y;
            const distCovered = viewportCenterY - currentTarget.y;
            let progress = distCovered / distTotal;
            
            // 범위 제한
            progress = Math.max(0, Math.min(1, progress));

            finalX = currentTarget.x + (nextTarget.x - currentTarget.x) * progress;
            finalY = currentTarget.y + (nextTarget.y - currentTarget.y) * progress;
        }

        // 동그라미 위치 적용
        scrollDot.style.left = `${finalX - window.scrollX}px`;
        scrollDot.style.top = `${finalY - window.scrollY}px`;

        // [스타일 및 이벤트 적용] 가장 가까운 타겟 기준
        if (closestTarget) {
            updateDotStyle(closestTarget.id);

            // Important 텍스트 강조 효과
            if (closestTarget.id === 'important-text') {
                importantSection.classList.add('is-focused');
            } else {
                importantSection.classList.remove('is-focused');
            }

            // STOP 이미지 교체 효과
            if (closestTarget.id === 'stop') {
                // 동그라미가 중앙 근처에 왔을 때 (오차 100px)
                if (minDiff < 100 && stopWrapper) {
                     stopWrapper.classList.add('is-reached');
                }
            } else {
                if (stopWrapper) stopWrapper.classList.remove('is-reached');
            }
        }
    };

    // 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => { updateLayout(); handleScroll(); });
    window.addEventListener('load', () => { updateLayout(); handleScroll(); });

    // 초기 실행
    updateLayout();
    handleScroll();
});