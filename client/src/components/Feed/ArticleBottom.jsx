import React, { useEffect, useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../../components/Common/Button/Button';
import common from '../../constants/commonStyle';
import colors from '../../constants/colors';
import { ReactComponent as Heart } from '../../assets/heart_active.svg';
import { doArticleLike, cancelArticleLike } from '../../api/article';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { useUserState } from '../../contexts/User/UserContext';

const ArticleBottom = ({ isLiked, likeCnt, rentPrice, writerId, nickname }) => {
	const { articleId } = useParams();
	const { setHasBottom } = useGlobalContext();
	useEffect(() => {
		setHasBottom(true);
		return () => {
			setHasBottom(false);
		};
	}, []);
	const [liked, setLiked] = useState(isLiked);
	const [count, setCount] = useState(likeCnt);
	const rentPriceComma = rentPrice.toLocaleString();
	const doHeartClickHandler = async () => {
		const data = await doArticleLike(articleId);
		if (data === '좋아요 성공') {
			setLiked(!liked);
			setCount(count + 1);
		}
	};

	const cancelHeartClickHandler = async () => {
		const data = await cancelArticleLike(articleId);
		if (data === '좋아요 취소') {
			setLiked(!liked);
			setCount(count - 1);
		}
	};

	const navigate = useNavigate();
	const { loginedUserId } = useUserState();
	return (
		<div
			css={css`
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				max-width: 1200px;
				padding: 30px;
				position: fixed;
				bottom: 0;
				z-index: 100;
				height: ${common.bottomHeaderHeight};
				box-shadow: 0 0.2px ${colors.text};
			`}
		>
			{/* 찜, 대여 가격 */}
			<div
				css={css`
					display: flex;
					align-items: center;
				`}
			>
				{/* 찜 */}
				<div onClick={liked ? cancelHeartClickHandler : doHeartClickHandler}>
					<Heart fill={liked ? 'red' : 'white'} stroke={liked ? 'red' : 'black'} />
					<div className="fw-500 fs-16" style={{ lineHeight: '22.59px', textAlign: 'center' }}>
						{count}
					</div>
				</div>
				{/* 대여 가격 */}
				<div
					css={css`
						display: flex;
						align-items: center;
						padding-left: 22px;
					`}
				>
					<span className="fw-400 fs-20" style={{ lineHeight: '34.75px' }}>
						일
					</span>
					<span className="fw-700 fs-24" style={{ paddingLeft: '8px', lineHeight: '28.8px' }}>
						{rentPriceComma}원
					</span>
				</div>
			</div>
			{/* 채팅하기 버튼 */}
			<div style={{ width: 133 }}>
				{loginedUserId === writerId ? (
					<Button
						type="active"
						label="수정하기"
						style={{ padding: 10 }}
						onClick={() => navigate(`/article/modify/${articleId}`)}
					/>
				) : (
					<Button
						type="active"
						label="채팅하기"
						style={{ padding: 10 }}
						onClick={() =>
							// todo : 채팅방 옮길때 추가정보 필요했는데 기억안남 나중에수정
							navigate('/chat/room', {
								state: { roomId: null, receiverId: writerId, nickname },
							})
						}
					/>
				)}
			</div>
		</div>
	);
};

export default ArticleBottom;
