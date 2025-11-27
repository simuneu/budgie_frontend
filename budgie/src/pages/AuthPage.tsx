import { useState } from 'react'
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";




export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");
  const navigate = useNavigate();
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [step, setStep] = useState(1);
  const [newPwConfirm, setNewPwConfirm] = useState("");



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
                .post("/auth/login", { email, password })
                .then((res: { data: { accessToken: string; refreshToken: string } }) => {
                  localStorage.setItem("accessToken", res.data.accessToken);
                  localStorage.setItem("refreshToken", res.data.refreshToken);
                  toast.success("로그인 성공!");

                  setTimeout(() => {
                    navigate("/app/dashboard");
                  }, 800);
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
                .post("/auth/signup", { email, password, nickname })
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
                    .post("/auth/email/send", { email })
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
                    .post("/auth/email/verify", { email, code })
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
        {isLogin && (
          <button
            type="button"
            className="text-sm text-pink-500 mt-3 hover:underline w-full text-center"
            onClick={() => setShowResetModal(true)}
          >
            비밀번호를 잊으셨나요?
          </button>
        )}

        {/* SNS 로그인 버튼 영역 */}
        <div className="mt-8">
          {/* <p className="text-center text-gray-500 mb-3">또는 SNS 계정으로 로그인</p> */}
          <div className="flex justify-center gap-4">
            {/* 네이버 로그인 */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/api/auth/naver/loginstart";              }}
              className="focus:outline-none"
            >
              <img
                src="/naver_login.png"
                alt="네이버 로그인"
                className="w-[183px] h-11 rounded-md overflow-hidden bg-[#03C75A] flex items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-transform hover:-translate-y-[2px] focus:outline-none"
              />
            </button>

            {/* 카카오 로그인 */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/api/auth/kakao/loginstart";
              }}
              className="focus:outline-none"
            >
              <img
                src="/kakao_login.png"
                alt="카카오 로그인"
                className="w-[183px] h-11 rounded-md overflow-hidden bg-[#FEE500] flex items-center justify-center shadow-sm hover:shadow-md transition-transform hover:-translate-y-[2px] focus:outline-none"
              />
            </button>
          </div>
        </div>


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

      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">

            <h3 className="text-2xl font-bold text-center mb-4">비밀번호 재설정</h3>

            {step === 1 && (
              <>
                <label className="block text-gray-600 mb-1">이메일</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="이메일 입력"
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />

                <button
                  onClick={() => {
                    axios.post("/auth/password/reset-request",
                      { email: resetEmail }
                    )
                      .then(() => {
                        toast.success("인증코드가 이메일로 전송되었습니다.");
                        setStep(2);
                      })
                      .catch(() => toast.error("존재하지 않는 이메일입니다."));
                  }}
                  className="w-full py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500"
                >
                  인증 코드 보내기
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <label className="block text-gray-600 mb-1">인증 코드</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="코드 입력"
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />

                <label className="block text-gray-600 mb-1">새 비밀번호</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="새 비밀번호"
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />

                {/* 비밀번호 확인 input 추가 */}
                <label className="block text-gray-600 mb-1">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={newPwConfirm}
                  onChange={(e) => setNewPwConfirm(e.target.value)}
                  placeholder="새 비밀번호 확인"
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />

                <button
                  onClick={() => {
                    //  비밀번호 정책 검증
                    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

                    if (!passwordRegex.test(newPw)) {
                      toast.error("비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.");
                      return;
                    }

                    //  비밀번호 일치 검증
                    if (newPw !== newPwConfirm) {
                      toast.error("새 비밀번호가 일치하지 않습니다.");
                      return;
                    }

                    axios.post("/auth/password/reset", {
                      email: resetEmail,
                      code: resetCode,
                      newPassword: newPw,
                    })
                      .then(() => {
                        toast.success("비밀번호가 성공적으로 변경되었습니다.");
                        setShowResetModal(false);
                        setStep(1);
                        setResetEmail("");
                        setResetCode("");
                        setNewPw("");
                        setNewPwConfirm("");
                      })
                      .catch(() => toast.error("코드 또는 비밀번호를 확인해주세요."));
                  }}
                  className="w-full py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500"
                >
                  비밀번호 변경 완료
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowResetModal(false);
                setStep(1);
              }}
              className="block w-full text-center mt-4 text-gray-500 hover:underline"
            >
              닫기
            </button>

          </div>
        </div>
      )}

    </div>
    
  );
}

