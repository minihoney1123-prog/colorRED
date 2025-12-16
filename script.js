gsap.registerPlugin(ScrollTrigger);

// 전체 애니메이션 타임라인
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

/* --- [Scene 1 -> Scene 2] : 공 -> STOP 표지판 --- */
tl.to(".stop-sign", {
    scrollTrigger: {
        trigger: ".scene-stop",
        start: "top center",
        end: "center center",
        scrub: true
    },
    opacity: 1 // STOP 표지판 나타남 (공 위에 덮어씌움)
});

// 자동차 등장
gsap.from(".car", {
    scrollTrigger: {
        trigger: ".scene-stop",
        start: "top bottom",
        end: "center center",
        scrub: 1
    },
    xPercent: -150 
});


/* --- [Scene 2 -> Scene 3] : STOP -> 하트 --- */

// 1. STOP 표지판 사라짐 (뒤에 있던 공이 다시 보임)
tl.to(".stop-sign", {
    scrollTrigger: {
        trigger: ".scene-love",
        start: "top bottom",
        end: "top center",
        scrub: true
    },
    opacity: 0
})

// 2. 공 -> 하트 변신
.to(".sticky-ball", {
    scrollTrigger: {
        trigger: ".scene-love",
        start: "center 60%", 
        end: "center center",
        scrub: true
    },
    opacity: 0, // 공 사라짐
    scale: 0.5
})
.to(".heart-shape", {
    scrollTrigger: {
        trigger: ".scene-love",
        start: "center 60%", 
        end: "center center",
        scrub: true
    },
    opacity: 1, // 하트 나타남
    scale: 1.2,
    rotation: 360,
    from: { rotation: 0 }
});


/* --- [Scene 3 -> Scene 4] : 하트 -> 다시 공 (OK 준비) --- */
/* ★ 여기가 문제였던 부분입니다! 확실하게 추가했습니다 ★ */

// 1. 하트 사라짐
tl.to(".heart-shape", {
    scrollTrigger: {
        trigger: ".scene-ok", // OK 페이지가 올라올 때
        start: "top bottom",
        end: "top center",
        scrub: true
    },
    opacity: 0,     // 하트 투명해짐
    scale: 0.5,     // 작아짐
    rotation: -360  // 반대로 돔
}, "reset-ball")    // "reset-ball"이라는 이름으로 묶어서 동시에 실행

// 2. 공 다시 나타남 (투명도 0 -> 1)
.to(".sticky-ball", {
    scrollTrigger: {
        trigger: ".scene-ok",
        start: "top bottom",
        end: "top center",
        scrub: true
    },
    opacity: 1, // 공 다시 보임!
    scale: 1    // 원래 크기로 복구
}, "reset-ball");


/* --- [Scene 4] : OK 완성 --- */
// 공이 'O' 자리에 도착했을 때 (화면 정중앙)

// 1. K 글자 색상 변경 (검정 -> 빨강)
tl.to(".k-text", {
    scrollTrigger: {
        trigger: ".scene-ok",
        start: "center center",
        end: "center center",
        scrub: true,
        toggleActions: "play none none reverse"
    },
    color: "#E60000"
}, "ok-finish")

// 2. 체크표시 나타남
.to(".checkmark", {
    scrollTrigger: {
        trigger: ".scene-ok",
        start: "center center",
        end: "center center",
        scrub: true,
        toggleActions: "play none none reverse"
    },
    opacity: 1,
    scale: 1,
    ease: "back.out(1.7)",
    from: { scale: 0.5 }
}, "ok-finish");


/* script.js 수정 (마지막 부분 교체) */

// --- [Scene 5: NO 복구] ---
tl.to(".n-text", {
    scrollTrigger: {
        trigger: ".scene-no",
        start: "center center",
        end: "center center",
        toggleActions: "play none none reverse"
    },
    color: "#E60000" // N 빨갛게
}, "no-scene");

tl.to(".decline-icon", {
    scrollTrigger: {
        trigger: ".scene-no",
        start: "center center",
        end: "center center",
        toggleActions: "play none none reverse"
    },
    opacity: 1, // 아이콘 짠!
    scale: 1.2,
    ease: "back.out(1.7)",
    from: { scale: 0.5 }
}, "no-scene");


// --- [Scene 6 정리: 수도꼭지 치우기] ---
tl.to(".faucet-body", {
    scrollTrigger: {
        trigger: ".important-section",
        start: "top bottom",
        end: "top center",
        scrub: true
    },
    y: -1000,
    opacity: 0
});

// --- [Scene 7] JS 코드 (보내주신 것과 동일) ---

// 타임라인과 완전히 분리
ScrollTrigger.create({
    trigger: ".important-section",
    start: "top center",
    end: "bottom center",

    onEnter: () => {
        console.log("변신 시작!");
        document.querySelector(".important-section")
          .classList.add("is-active");
        document.querySelector(".sticky-ball")
          .classList.add("is-highlighting");
    },

    onLeaveBack: () => {
        document.querySelector(".important-section")
          .classList.remove("is-active");
        document.querySelector(".sticky-ball")
          .classList.remove("is-highlighting");
    }
});


// --- [Scene 8: REC 깜빡임] ---

ScrollTrigger.create({
    trigger: ".scene-rec",
    start: "center center", // 화면 중앙에 오면
    end: "bottom bottom",
    
    // 들어오면: 녹화 모드 ON
    onEnter: () => {
        // 혹시 7번 장면 스타일이 남아있다면 강제 제거
        document.querySelector(".important-section").classList.remove("is-active");
        document.querySelector(".sticky-ball").classList.remove("is-highlighting");
        
        // 깜빡임 클래스 추가
        document.querySelector(".sticky-ball").classList.add("is-recording");
    },
    
    // 뒤로 나가면: 녹화 모드 OFF
    onLeaveBack: () => {
        document.querySelector(".sticky-ball").classList.remove("is-recording");
        
        // (선택사항) 위로 올라갈 때 7번 장면 효과를 다시 살리고 싶다면 아래 주석 해제
        // document.querySelector(".important-section").classList.add("is-active");
        // document.querySelector(".sticky-ball").classList.add("is-highlighting");
    }
});

// --- [Scene 9: 배터리 매직 스왑 (깜빡임 제거 추가)] ---

ScrollTrigger.create({
    trigger: ".scene-battery",
    start: "center center",
    end: "bottom center",
    
    // [들어오면]
    onEnter: () => {
        const ball = document.querySelector(".sticky-ball");
        
        // 1. [핵심!] 깜빡임 애니메이션 강제 정지
        ball.style.animation = "none"; 
        
        // 2. 진짜 공 숨기기
        ball.classList.add("force-hide");
        
        // 3. 배터리 안의 네모 보여주기
        document.querySelector(".battery-fill").style.opacity = "1";
    },
    
    // [나가면]
    onLeaveBack: () => {
        const ball = document.querySelector(".sticky-ball");
        
        // 1. 애니메이션 스타일 초기화 (다시 위로 갔을 때를 위해)
        ball.style.animation = ""; 
        
        // 2. 진짜 공 다시 보이기
        ball.classList.remove("force-hide");
        
        // 3. 배터리 네모 숨기기
        document.querySelector(".battery-fill").style.opacity = "0";
    }
});
