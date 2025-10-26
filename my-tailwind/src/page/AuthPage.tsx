import { useState } from 'react'
import axios from "axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-sky-100 via-pink-100 to-white p-6">
      {/* 소개 섹션 */}
      <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
        <h1 className="text-5xl font-bold text-pink-500 mb-4">💰 Budgie 가계부</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          당신의 소비를 기록하고 목표를 이뤄보세요.<br />
          예산을 관리하고, 통계를 통해 더 똑똑한 소비습관을 만드세요 🌿
        </p>
      </div>

      {/* 로그인 / 회원가입 폼 */}
      <div className="md:w-1/2 w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-pink-500">
          {isLogin ? "로그인" : "회원가입"}
        </h2>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();

            if (isLogin) {
              // 로그인 요청
              axios
                .post("http://localhost:8080/api/auth/login", { email, password })
                .then((res: { data: { accessToken: string; refreshToken: string } }) => {
                  localStorage.setItem("accessToken", res.data.accessToken);
                  localStorage.setItem("refreshToken", res.data.refreshToken);
                  alert("로그인 성공!");
                })
                .catch(() => alert("로그인 실패! 이메일 또는 비밀번호를 확인하세요."));
            } else {
              // 비밀번호 확인 검증
              if (password !== passwordConfirm) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
              }

              // 이메일 인증 확인 여부 검증
              if (!isVerified) {
                alert("이메일 인증을 완료해주세요.");
                return;
              }

              // 회원가입 요청
              axios
                .post("http://localhost:8080/api/auth/signup", { email, password, nickname })
                .then(() => alert("회원가입 성공! 로그인해주세요."))
                .catch(() => alert("회원가입 실패! 입력 정보를 확인해주세요."));
            }
          }}
        >
          {!isLogin && (
            <>
              <div>
                <label className="block text-gray-600 mb-1">닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-600 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-600 mb-1">비밀번호 확인</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          )}

          {!isLogin && (
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  axios
                    .post("http://localhost:8080/api/auth/email/send", { email })
                    .then(() => alert("인증 이메일이 발송되었습니다."))
                    .catch(() => alert("이메일 발송 실패"));
                }}
                className="text-sm text-pink-500 hover:underline whitespace-nowrap"
              >
                인증 메일 보내기
              </button>

              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="인증 코드 입력"
                className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              <button
                type="button"
                onClick={() => {
                  axios
                    .post("http://localhost:8080/api/auth/email/verify", { email, code })
                    .then(() => {
                      setIsVerified(true);
                      setVerifyMsg("✅ 인증 성공!");
                    })
                    .catch(() => {
                      setIsVerified(false);
                      setVerifyMsg("❌ 인증 실패. 코드를 확인해주세요.");
                    });
                }}
                className="text-sm text-pink-500 hover:underline whitespace-nowrap"
              >
                확인
              </button>
            </div>
          )}

          {/* 인증 결과 메시지 */}
          {!isLogin && verifyMsg && (
            <p className={`text-sm mt-1 ${isVerified ? "text-green-500" : "text-red-500"}`}>
              {verifyMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition"
          >
            {isLogin ? "로그인" : "회원가입"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-500 font-medium hover:underline"
          >
            {isLogin ? "회원가입" : "로그인"}
          </button>
        </p>
      </div>
    </div>
  );
}

//회원 가입 성공시, 로그인 창으로 자동으로 이동하게 하기
//버튼 클릭 후엔 인풋창 비워주기
//alert토스트로 변경하기
