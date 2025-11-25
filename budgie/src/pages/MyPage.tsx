import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function MyPage() {
  const [nickname, setNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [passwordOld, setPasswordOld] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordNewConfirm, setPasswordNewConfirm] = useState("");
  const [deletePw, setDeletePw] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePwError, setDeletePwError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");


  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();


  // 유저 정보 불러오기
  const fetchInfo = async () => {
    try {
      const res = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNickname(res.data.nickname);
      setNewNickname(res.data.nickname);
    } catch (err) {
      console.error(err);
    }
  };

  // 회원탈퇴 버튼 클릭 시
    const openDeleteModal = async () => {
    const pw = deletePw.trim();

    if (!pw) {
        toast.warning("비밀번호를 입력하세요.");
        return;
    }

    try {
        // 비밀번호 검증용 요청
        await axios.post(
        "/api/auth/check-password",
        { password: pw },
        { headers: { Authorization: `Bearer ${token}` } }
        );

        // 비밀번호 맞음 → 모달 오픈
        setShowDeleteModal(true);

    } catch {
        // 비밀번호 틀림 → 안내문 표시
         setDeletePwError("비밀번호가 일치하지 않습니다.");
    }
    };

  useEffect(() => {
    fetchInfo();
  }, []);

  // 닉네임 변경
  const handleNicknameChange = async () => {
    if (newNickname.trim() === "") {
      toast.warning("닉네임을 입력하세요.");
      return;
    }

    try {
      await axios.put(
        "/api/users/nickname",
        { nickname: newNickname },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("닉네임이 변경되었습니다!");
      setNickname(newNickname);
      localStorage.setItem("nicknameChanged", Date.now().toString());
      window.dispatchEvent(new Event("nicknameChanged"));

    } catch {
      toast.error("닉네임 변경 실패");
    }
  };

  //탈퇴
  const handleDelete = async () => {
    if (deletePw.trim() === "") {
      toast.warning("비밀번호를 입력하세요.");
      return;
    }

    try {
      await axios.delete("/api/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: deletePw },
      });

      toast.success("회원 탈퇴가 완료되었습니다.");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      navigate("/");

    } catch {
      toast.error("비밀번호가 일치하지 않습니다.");
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    console.log(token)
    console.log("oldPassword state:", passwordOld);
console.log("newPassword state:", passwordNew);
console.log("confirm state:", passwordNewConfirm);
  setPasswordError("");
  setNewPasswordError("");

  // 새 비번 규칙 (백엔드 동일)
    const PASSWORD_REGEX =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!PASSWORD_REGEX.test(passwordNew)) {
        setNewPasswordError("비밀번호는 영문/숫자/특수문자 포함 8자리 이상이어야 합니다.");
        return;
    }

    if (passwordNew !== passwordNewConfirm) {
        setNewPasswordError("새 비밀번호가 일치하지 않습니다.");
        return;
    }

    try {
        await axios.put(
        "/api/users/password",
        {
            currentPassword: passwordOld,
            newPassword: passwordNew,
        },
        { headers: { Authorization: `Bearer ${token}` } }
        );

         toast.success("비밀번호가 성공적으로 변경되었습니다! 🎉");
         //입력초기화
        setPasswordOld("");
        setPasswordNew("");
        setPasswordNewConfirm("");
        setNewPasswordError("");
    } catch (err: any) {
        if (err.response?.status === 400) {
        setPasswordError("현재 비밀번호가 일치하지 않습니다.");
        } else {
        setPasswordError("비밀번호 변경 실패");
        }
    }
    };


  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto bg-white/80 rounded-2xl shadow-xl p-8">

        {/* 페이지 제목 */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">마이페이지</h1>

        <div className="flex flex-col gap-8">

          {/* 닉네임 변경 카드 */}
          <section className="max-w-md mx-auto w-full">
            <h2 className="text-xl font-semibold mb-4">닉네임 변경</h2>

            <label className="block text-gray-600 mb-1">현재 닉네임</label>
            <input
            type="text"
            value={nickname}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />

            <label className="block text-gray-600 mt-4 mb-1">새 닉네임</label>
            <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-300"
            />

            <button
            onClick={handleNicknameChange}
            className="mt-4 w-full py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition"
            >
            닉네임 변경
            </button>
        </section>


          {/* 비밀번호 변경 카드 */}
          <section className="max-w-md mx-auto w-full">
            <h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>

            <label className="block text-gray-600 mb-1">현재 비밀번호</label>
            <input
            type="password"
            value={passwordOld}
            onChange={(e) => {
                setPasswordOld(e.target.value);
                setPasswordError("");
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-300 ${
                passwordError ? "border-red-500 bg-red-50" : ""
            }`}
            />

            {passwordError && (
            <p className="text-red-500 text-sm mt-2 font-medium">
                {passwordError}
            </p>
            )}


            <label className="block text-gray-600 mt-4 mb-1">새 비밀번호</label>
            <input
                type="password"
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-300
                    ${newPasswordError ? "border-red-500 bg-red-50" : ""}`}
                />

                {newPasswordError && (
                <p className="text-red-500 text-sm mt-2 font-medium">{newPasswordError}</p>
                )}

            <label className="block text-gray-600 mt-4 mb-1">새 비밀번호 확인</label>
            <input
            type="password"
            value={passwordNewConfirm}
            onChange={(e) => setPasswordNewConfirm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-300"
            />

            <button
            onClick={handlePasswordChange}
            className="mt-4 w-full py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition"
            >
            비밀번호 변경
            </button>
        </section>
        {/* 회원탈퇴 */}
          <section className="max-w-md mx-auto w-full">
            <h2 className="text-xl font-semibold mb-3 text-pink-600">회원 탈퇴</h2>

            <p className="text-sm text-gray-600 mb-3">
            탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>

            <input
                type="password"
                value={deletePw}
                onChange={(e) => {
                setDeletePw(e.target.value);
                setDeletePwError(""); // 입력할 때 에러 메시지 제거
                }}
                placeholder="비밀번호 입력"
                className={`px-4 py-2 border rounded-lg w-full ${
                deletePwError ? "border-red-500" : ""
                }`}
            />

            {/* 에러 안내문구 */}
            {deletePwError && (
                <p className="text-red-500 text-sm mt-1">{deletePwError}</p>
            )}

            <button
                onClick={openDeleteModal}
                className="mt-4 w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
                회원 탈퇴
            </button>
        </section>
        </div>

        {showDeleteModal && (
            <ConfirmDeleteModal
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
            />
        )}
      </div>
    </div>
  );
}
