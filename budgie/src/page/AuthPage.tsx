import { useState } from 'react'
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";




export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  const resetInputs = () => {
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setNickname("");
    setCode("");
    setIsVerified(false);
    setVerifyMsg("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center 
      bg-gradient-to-br from-teal-200 via-pink-100 to-white 
      bg-[length:400%_400%] animate-gradient-move p-6">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      {/* 소개 섹션 */}
     <motion.div
      className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }} // 초기 등장 효과 유지
    >
      {/* 🐥 타이틀 - 글자별 파도 모션 */}
      <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
        <img 
        src="https://em-content.zobj.net/source/microsoft-teams/337/front-facing-baby-chick_1f425.png" 
        alt="아기 병아리 이모티콘" 
        className="inline-block h-12 w-auto mr-2" 
        />    
        {"BUDGIE".split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: 0 }}
            animate={{ y: [0, -8, 0] }} // 위로 들썩였다 내려옴
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.05,
              ease: "easeInOut",
              delay: i * 0.1, // 글자 순서대로 파도 효과
            }}
            style={{ display: "inline-block" }}
          >
            {char}
          </motion.span>
        ))}  {" "}
        <img 
        src="https://em-content.zobj.net/source/microsoft-teams/337/front-facing-baby-chick_1f425.png" 
        alt="아기 병아리 이모티콘" 
        className="inline-block h-12 w-auto mr-2" 
        />    
      </h1>

      <p className="text-gray-600 text-xl font-semibold leading-relaxed">
        당신의 소비를 기록하고 목표를 이뤄보세요.<br />
        혼자하기 힘든 예산관리, 당신의 친구인{" "}
        <span className="text-pink-400 font-bold">우리</span>가 함께 도와줄게요!
      </p>
    </motion.div>

      {/* 로그인 / 회원가입 폼 */}
      <div className="md:w-1/2 w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-00">
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
                  toast.success("로그인 성공!");
                })
                .catch(() => toast.error("로그인 실패! 이메일 또는 비밀번호를 확인하세요."));
            } else {
              // 비밀번호 확인 검증s
              if (password !== passwordConfirm) {
                toast.warning("비밀번호가 일치하지 않습니다.");
                return;
              }

              // 이메일 인증 확인 여부 검증
              if (!isVerified) {
                toast.warning("이메일 인증을 완료해주세요.");
                return;
              }

              // 회원가입 요청
              axios
                .post("http://localhost:8080/api/auth/signup", { email, password, nickname })
                 .then(() => {
                  toast.success("회원가입 성공! 로그인 페이지로 이동합니다.");
                  resetInputs();
                  setTimeout(() => setIsLogin(true), 2000);
                })
                .catch(() => toast.error("회원가입 실패! 입력 정보를 확인해주세요."));
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
                    .then(() => toast.info("인증 이메일이 발송되었습니다."))
                    .catch(() => toast.error("이메일 발송 실패"));
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
                      setVerifyMsg("✅ 인증 성공!✅");
                    })
                    .catch(() => {
                      setIsVerified(false);
                      setVerifyMsg("❌ 인증 실패. 코드를 확인해주세요.❌");
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

//버튼 클릭 후엔 인풋창 비워주기
//alert토스트로 변경하기

 {/* <img 
        src="https://em-content.zobj.net/source/microsoft-teams/337/front-facing-baby-chick_1f425.png" 
        alt="아기 병아리 이모티콘" 
        className="inline-block h-12 w-auto mr-2" 
        />     */}
