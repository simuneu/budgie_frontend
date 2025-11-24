import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function MyPage() {
  const [nickname, setNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [passwordOld, setPasswordOld] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordNewConfirm, setPasswordNewConfirm] = useState("");

  const token = localStorage.getItem("accessToken");

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
    } catch {
      toast.error("닉네임 변경 실패");
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    if (passwordNew !== passwordNewConfirm) {
      toast.warning("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.put(
        "/api/users/password",
        {
          oldPassword: passwordOld,
          newPassword: passwordNew,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("비밀번호가 변경되었습니다!");
      setPasswordOld("");
      setPasswordNew("");
      setPasswordNewConfirm("");
    } catch {
      toast.error("비밀번호 변경 실패");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto bg-white/80 rounded-2xl shadow-xl p-8">

        {/* 페이지 제목 */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">마이페이지</h1>

        <div className="flex flex-col gap-8">

          {/* 닉네임 변경 카드 */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">닉네임 변경</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-600 mb-1">현재 닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">새 닉네임</label>
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <button
                onClick={handleNicknameChange}
                className="w-full py-2 bg-pink-400 text-white font-semibold rounded-lg hover:bg-pink-500 transition"
              >
                닉네임 변경
              </button>
            </div>
          </div>

          {/* 비밀번호 변경 카드 */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-600 mb-1">현재 비밀번호</label>
                <input
                  type="password"
                  value={passwordOld}
                  onChange={(e) => setPasswordOld(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">새 비밀번호</label>
                <input
                  type="password"
                  value={passwordNew}
                  onChange={(e) => setPasswordNew(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordNewConfirm}
                  onChange={(e) => setPasswordNewConfirm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <button
                onClick={handlePasswordChange}
                className="w-full py-2 bg-pink-400 text-white font-semibold rounded-lg hover:bg-pink-500 transition"
              >
                비밀번호 변경
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
