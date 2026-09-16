# CoffeeOrderApp

Next.js App Router와 API Routes를 기반으로 제작한 모바일 커피 주문 및 관리자 웹 애플리케이션입니다.
PWA를 적용해 모바일 환경에서 앱처럼 사용할 수 있도록 구성했으며, 상품 주문부터 결제·주문 관리와 관리자 상품·재고 관리까지 구현했습니다.

* 개발 형태: 기획부터 배포까지 단독 수행
* 서비스: https://jongju-coffee-order-app.vercel.app/
* 관리자: https://jongju-coffee-order-app.vercel.app/admin/admin_login
* GitHub: https://github.com/seongjongju/CoffeeOrder-app
* 포트폴리오: https://portfolio-kappa-tan-62.vercel.app/

> 관리자 테스트 계정은 포트폴리오 페이지에서 확인할 수 있습니다.

## 주요 기능

### 사용자

* 카테고리별 상품 조회 및 디바운스 기반 상품 검색
* 상품 옵션, 수량 및 총 결제 금액 관리
* 장바구니 상품 관리
* 단일 상품 및 장바구니 주문
* 나이스페이 결제 연동 및 웹훅 기반 결제 승인 처리
* 주문 내역 및 동적 라우팅 기반 주문 상세 조회
* 주문 상태 변화에 따른 브라우저 알림
* JWT 기반 로그인 및 인증
* Nodemailer를 활용한 회원가입 및 비밀번호 변경
* PWA 홈 화면 추가 및 서비스 워커 적용
* API 요청 중복 방지를 위한 로딩 처리

### 관리자

* JWT 기반 관리자 전용 인증
* 매출 및 주문 데이터 대시보드
* Chart.js 기반 데이터 시각화
* 상품 등록 및 수정
* 상품 및 재고 관리
* 체크박스 기반 상품 다중 선택 및 일괄 삭제
* 카테고리 및 키워드 필터링
* 날짜 범위 기반 데이터 조회

## 기술 스택

### 프론트엔드

* Next.js App Router
* React
* TypeScript
* Redux Toolkit
* React Query
* Axios
* CSS

### 백엔드 및 데이터

* Next.js API Routes
* MongoDB
* JWT
* Nodemailer

### 결제 및 웹 기능

* 나이스페이
* Webhook
* Web Notification API
* PWA / Service Worker
* Chart.js

### 배포 및 외부 서비스

* Vercel
* Cloudinary

## 개발 환경 설정 및 실행 방법

### 1. 프로젝트 클론 및 패키지 설치

```bash
git clone https://github.com/seongjongju/CoffeeOrder-app.git
cd CoffeeOrder-app
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 환경변수를 설정합니다.

```env
# URL
NEXT_PUBLIC_FRONT_API_URL=http://localhost:3000

# DB
DB_PORT=4000
DB_NAME=coffeeOrderDB
MONGO_URI=your_mongo_uri

# JWT
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ADMIN_ACCESS_SECRET=your_jwt_admin_access_secret
JWT_ADMIN_REFRESH_SECRET=your_jwt_admin_refresh_secret

# Mail
GMAIL_USER=your_gmail_account
GMAIL_APP_PASSWORD=your_gmail_app_password

# 나이스페이먼츠
NEXT_PUBLIC_NICEPAY_SECRET_KEY=your_nicepay_secret_key
NEXT_PUBLIC_NICEPAY_CLIENT_ID=your_nicepay_client_id
NEXT_PUBLIC_NICEPAY_URL=your_nicepay_url

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# 개발환경
NODE_ENV=development
NODE_SAME=none
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.
