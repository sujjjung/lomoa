const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your_super_secret_jwt_key_lomoa';
const LOSTARK_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDA0OTUzNzkifQ.gW6Pc6iqbIbOjadPfVxwpGJZzWElbwfSelI0TBKqxJWMBJdNwWGaPdhd553pZlJNizcXsl155IQ3aazFxKYAzLC47ssx_rwzqaTIDlJ1dXpf35JoK6q7Zj55A3R7gsQu-I4l3Zngca4NlIRasihxLifrWltjYBUHAoCyom-dNenTmkX5Khb3d-BfdoL_yihZadhF-Gtx2XQllGDrXvQ0ab7aK_W7MSEeax9E99ix39k-da5GjBEkPxxjMuQSW8GxjwyEK1tOcES9eh42Jlu6lpU3mj9XJE7cNbdI8TVpLCpiKmMLBBNdMHMk095EhSiaRpCoS8aYRrhzKTb1QOwWbw";

// --- 데이터베이스 연결 풀 ---
const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'lomoa_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  jsonStrings: true
});

async function initializeDatabase() {
  const connection = await dbPool.getConnection();
  try {
    console.log('MySQL에 성공적으로 연결되었습니다.');
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM raids');
    if (rows[0].count === 0) {
      console.log('raids 테이블 초기 데이터 삽입 중...');
      const raidData = [
        ['valtan_single', '발탄', '싱글', 2, 1415, JSON.stringify([500, 700]), JSON.stringify([300, 400])],
        ['valtan_normal', '발탄', '노말', 2, 1415, JSON.stringify([500, 700]), JSON.stringify([300, 400])],
        ['valtan_hard', '발탄', '하드', 2, 1445, JSON.stringify([700, 1100]), JSON.stringify([450, 600])],
        ['viakiss_single', '비아키스', '싱글', 2, 1430, JSON.stringify([600, 1000]), JSON.stringify([300, 450])],
        ['viakiss_normal', '비아키스', '노말', 2, 1430, JSON.stringify([600, 1000]), JSON.stringify([300, 450])],
        ['viakiss_hard', '비아키스', '하드', 2, 1460, JSON.stringify([900, 1500]), JSON.stringify([500, 650])],
        ['kouku_saton_single', '쿠크세이튼', '싱글', 3, 1475, JSON.stringify([600, 900, 1500]), JSON.stringify([300, 500, 700])],
        ['kouku_saton_normal', '쿠크세이튼', '노말', 3, 1475, JSON.stringify([600, 900, 1500]), JSON.stringify([300, 500, 700])],
        ['abrelshud_dejavu', '아브렐슈드', '싱글', 4, 1490, JSON.stringify([1000, 1000, 1000, 1600]), JSON.stringify([250, 300, 400, 600])],
        ['abrelshud_normal', '아브렐슈드', '노말', 4, 1490, JSON.stringify([1000, 1000, 1000, 1600]), JSON.stringify([250, 300, 400, 600])],
        ['abrelshud_hard', '아브렐슈드', '하드', 4, 1540, JSON.stringify([1200, 1200, 1200, 2000]), JSON.stringify([400, 400, 500, 800])],
        ['kayangel_single', '카양겔', '싱글', 3, 1540, JSON.stringify([750, 1100, 1450]), JSON.stringify([180, 220, 270])],
        ['kayangel_normal', '카양겔', '노말', 3, 1540, JSON.stringify([750, 1100, 1450]), JSON.stringify([180, 220, 270])],
        ['kayangel_hard', '카양겔', '하드', 3, 1580, JSON.stringify([900, 1400, 2000]), JSON.stringify([225, 350, 500])],
        ['illiakan_single', '일리아칸', '싱글', 3, 1580, JSON.stringify([850, 1550, 2300]), JSON.stringify([190, 230, 330])],
        ['illiakan_normal', '일리아칸', '노말', 3, 1580, JSON.stringify([850, 1550, 2300]), JSON.stringify([190, 230, 330])],
        ['illiakan_hard', '일리아칸', '하드', 3, 1600, JSON.stringify([1200, 2000, 2800]), JSON.stringify([300, 500, 700])],
        ['ivory_tower_single', '혼돈의 상아탑', '싱글', 3, 1600, JSON.stringify([1200, 1600, 2400]), JSON.stringify([180, 220, 300])],
        ['ivory_tower_normal', '혼돈의 상아탑', '노말', 3, 1600, JSON.stringify([1200, 1600, 2400]), JSON.stringify([180, 220, 300])],
        ['ivory_tower_hard', '혼돈의 상아탑', '하드', 3, 1620, JSON.stringify([1400, 2000, 3800]), JSON.stringify([350, 500, 950])],
        ['kamen_single', '카멘', '싱글', 3, 1610, JSON.stringify([1600, 2000, 2800]), JSON.stringify([360, 440, 640])],
        ['kamen_normal', '카멘', '노말', 3, 1610, JSON.stringify([1600, 2000, 2800]), JSON.stringify([360, 440, 640])],
        ['kamen_hard', '카멘', '하드', 4, 1630, JSON.stringify([2000, 2400, 3600, 5000]), JSON.stringify([500, 600, 900, 1250])],
        ['echidna_prologue_single', '서막 에키드나', '싱글', 2, 1620, JSON.stringify([2300, 5000]), JSON.stringify([500, 960])],
        ['echidna_prologue_normal', '서막 에키드나', '노말', 2, 1620, JSON.stringify([2300, 5000]), JSON.stringify([500, 960])],
        ['echidna_prologue_hard', '서막 에키드나', '하드', 2, 1640, JSON.stringify([2800, 6000]), JSON.stringify([920, 1960])],
        ['behemoth_epic_normal', '에픽 베히모스', '노말', 2, 1640, JSON.stringify([2800, 6000]), JSON.stringify([920, 1960])],
        ['egir_act1_single', '1막 에기르', '싱글', 2, 1660, JSON.stringify([4750, 10750]), JSON.stringify([1030, 2400])],
        ['egir_act1_normal', '1막 에기르', '노말', 2, 1660, JSON.stringify([4750, 10750]), JSON.stringify([1030, 2400])],
        ['egir_act1_hard', '1막 에기르', '하드', 2, 1680, JSON.stringify([8000, 10750]), JSON.stringify([3640, 5880])],
        ['abrelshud_act2_normal', '2막 아브렐슈드', '노말', 2, 1670, JSON.stringify([7250, 14250]), JSON.stringify([3240, 4830])],
        ['abrelshud_act2_hard', '2막 아브렐슈드', '하드', 2, 1690, JSON.stringify([10000, 20500]), JSON.stringify([4500, 7200])],
        ['moredum_act3_normal', '3막 모르둠', '노말', 3, 1680, JSON.stringify([6000, 9500, 12500]), JSON.stringify([2400, 3200, 4200])],
        ['moredum_act3_hard', '3막 모르둠', '하드', 3, 1700, JSON.stringify([7000, 11000, 20000]), JSON.stringify([2700, 11000, 20000])],
        ['armoche_act4_normal', '4막 아르모체', '노말', 2, 1700, JSON.stringify([12500, 20500]), JSON.stringify([0, 0])],
        ['armoche_act4_hard', '4막 아르모체', '하드', 2, 1720, JSON.stringify([15000, 27000]), JSON.stringify([0, 0])],
        ['kazaros_epilogue_normal', '종막 카제로스', '노말', 2, 1710, JSON.stringify([14000, 26000]), JSON.stringify([0, 0])],
        ['kazaros_epilogue_hard', '종막 카제로스', '하드', 2, 1710, JSON.stringify([17000, 35000]), JSON.stringify([0, 0])],
        ['kazaros_epilogue_thefirst', '종막 카제로스', '더퍼스트', 2, 1710, JSON.stringify([17000, 35000]), JSON.stringify([0, 0])],
      ];
      await connection.query('INSERT INTO raids (id, raid_name, difficulty_name, gates, entry_level, gold_per_gate, more_gold_per_gate) VALUES ?', [raidData]);
      console.log('raids 테이블 데이터 삽입 완료.');
    }
    connection.release();
  } catch (err) {
    console.error("데이터베이스 초기화 오류:", err);
    connection.release();
  }
}

initializeDatabase();

// --- 미들웨어 ---
// JWT 토큰 유효성 검사
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: '토큰이 필요합니다.' });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        req.userId = decoded.id;
        next();
    });
};

// 개발용 DB 초기화 로직
app.delete('/api/dev/reset-database', async (req, res) => {
    console.warn("!!! 데이터베이스 전체 초기화 요청 수신 !!!");
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        // 외래 키 제약 조건을 잠시 비활성화하여 순서에 상관없이 삭제 가능하게 함
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // TRUNCATE TABLE은 데이터를 모두 삭제하고 AUTO_INCREMENT 값을 1로 초기화합니다.
        await connection.query('TRUNCATE TABLE character_raids');
        await connection.query('TRUNCATE TABLE characters');
        await connection.query('TRUNCATE TABLE users');
        await connection.query('TRUNCATE TABLE daily_homework');

        // 외래 키 제약 조건 다시 활성화
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        
        await connection.commit();
        console.warn("!!! 데이터베이스가 성공적으로 초기화되었습니다. !!!");
        res.status(200).json({ message: '데이터베이스가 성공적으로 초기화되었습니다.' });
    } catch (error) {
        await connection.rollback();
        console.error("데이터베이스 초기화 오류:", error);
        res.status(500).json({ message: '데이터베이스 초기화 중 오류가 발생했습니다.' });
    } finally {
        connection.release();
    }
});

// --- 스케줄러 (자동 초기화) ---
// 매주 수요일 오전 6시에 주간 숙제 초기화
cron.schedule('0 6 * * 3', async () => {
    console.log('주간 레이드 진행도 초기화를 시작합니다.');
    try {
        // 모든 캐릭터의 레이드 진행도를 false로 초기화
        await dbPool.query(`
            UPDATE character_raids cr
            JOIN raids r ON cr.raid_id = r.id
            SET cr.gate_progress = JSON_UNQUOTE(JSON_REPEAT('[false]', r.gates))
        `);
        console.log('주간 레이드 진행도가 성공적으로 초기화되었습니다.');
    } catch (error) {
        console.error('주간 레이드 초기화 중 오류 발생:', error);
    }
});

// 매일 오전 6시에 일일 숙제 초기화 및 휴식 게이지 업데이트
cron.schedule('0 6 * * *', async () => {
    console.log('일일 숙제 초기화를 시작합니다.');
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        // 어제 완료하지 않은 숙제에 대해 휴식 게이지 +10 (최대 100)
        await connection.query(`
            UPDATE daily_homework
            SET 
                guardian_rest = LEAST(100, guardian_rest + CASE WHEN guardian_done = false THEN 10 ELSE 0 END),
                kurzan_rest = LEAST(100, kurzan_rest + CASE WHEN kurzan_done = false THEN 10 ELSE 0 END)
        `);
        // 모든 일일 숙제 완료 여부를 false로 초기화
        await connection.query(`
            UPDATE daily_homework
            SET guardian_done = false, kurzan_done = false
        `);
        await connection.commit();
        console.log('일일 숙제가 성공적으로 초기화되었습니다.');
    } catch (error) {
        await connection.rollback();
        console.error('일일 숙제 초기화 중 오류 발생:', error);
    } finally {
        connection.release();
    }
});

// 원정대 캐릭터 목록 검색 API
app.post('/api/characters/find-roster', verifyToken, async (req, res) => {
    const { characterName } = req.body;
    const userId = req.userId;
    try {
        const [users] = await dbPool.query('SELECT apiKey FROM users WHERE id = ?', [userId]);
        if (users.length === 0 || !users[0].apiKey) {
            return res.status(400).json({ message: 'API 키가 등록되지 않았습니다. 프로필에서 API 키를 먼저 등록해주세요.' });
        }
        const { apiKey } = users[0];
        const { data: siblings } = await axios.get(`https://developer-lostark.game.onstove.com/characters/${characterName}/siblings`, {
            headers: { 'authorization': `bearer ${apiKey}` }
        });
        res.status(200).json(siblings);
    } catch (error) {
        console.error("원정대 검색 오류:", error.response?.data || error.message);
        res.status(500).json({ message: '원정대 정보를 불러오는 중 오류가 발생했습니다. 캐릭터명과 API 키를 확인해주세요.' });
    }
});

// 선택한 캐릭터들 일괄 추가 API
app.post('/api/characters/add-batch', verifyToken, async (req, res) => {
    const { charactersToAdd } = req.body;
    const userId = req.userId;
    if (!charactersToAdd || charactersToAdd.length === 0) {
        return res.status(400).json({ message: '추가할 캐릭터를 선택해주세요.' });
    }
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        // [개선] 레벨 순으로 정렬
        charactersToAdd.sort((a, b) => parseFloat((b.ItemAvgLevel || '0').replace(/,/g, '')) - parseFloat((a.ItemAvgLevel || '0').replace(/,/g, '')));

        const [existingCharacters] = await connection.query('SELECT character_name FROM characters WHERE user_id = ?', [userId]);
        const existingNames = new Set(existingCharacters.map(c => c.character_name));
        
        const newCharacters = charactersToAdd.filter(c => !existingNames.has(c.CharacterName));
        if (newCharacters.length === 0) {
            await connection.rollback();
            return res.status(409).json({ message: '선택한 캐릭터는 모두 이미 등록되어 있습니다.' });
        }

        const [allRaids] = await connection.query('SELECT id, entry_level, gates, gold_per_gate FROM raids');
        
        const [countResult] = await connection.query('SELECT COUNT(*) as count FROM characters WHERE user_id = ?', [userId]);
        let currentOrderIndex = countResult[0].count;

        for (const char of newCharacters) {
            const itemLevel = parseFloat((char.ItemAvgLevel || '0').replace(/,/g, ''));
            const [charInsertResult] = await connection.query(
                'INSERT INTO characters (user_id, character_name, character_level, character_class, avatar_url, order_index, is_gold_character) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, char.CharacterName, itemLevel, char.CharacterClassName, char.CharacterImage, currentOrderIndex++, itemLevel >= 1600]
            );
            const newCharId = charInsertResult.insertId;

            await connection.query('INSERT INTO daily_homework (character_id) VALUES (?)', [newCharId]);

            const eligibleRaids = allRaids
                .map(raid => ({ ...raid, totalGold: (JSON.parse(raid.gold_per_gate || '[]')).reduce((a, b) => a + b, 0) }))
                .filter(raid => raid.entry_level <= itemLevel)
                .sort((a, b) => b.totalGold - a.totalGold)
                .slice(0, 3);
            
            if (eligibleRaids.length > 0) {
                const raidsToInsert = eligibleRaids.map(raid => [
                    newCharId, raid.id, JSON.stringify(Array(raid.gates).fill(false)), JSON.stringify(Array(raid.gates).fill(true))
                ]);
                await connection.query('INSERT INTO character_raids (character_id, raid_id, gate_progress, more_gold_checked) VALUES ?', [raidsToInsert]);
            }
        }

        await connection.commit();
        res.status(201).json({ message: `${newCharacters.length}명의 캐릭터를 성공적으로 추가했습니다.` });

    } catch (error) {
        await connection.rollback();
        console.error("캐릭터 일괄 추가 오류:", error);
        res.status(500).json({ message: '캐릭터 추가 중 오류가 발생했습니다.' });
    } finally {
        connection.release();
    }
});

// 가입 API
app.post('/api/register', async (req, res) => {
    const { username, mainCharacter, password, apiKey } = req.body;
    if (!username || !mainCharacter || !password) {
        return res.status(400).json({ message: '필수 필드를 입력해주세요.' });
    }

    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        const hashedPassword = await bcrypt.hash(password, 10);
        const [userResult] = await connection.query(
            'INSERT INTO users (username, mainCharacter, password, apiKey) VALUES (?, ?, ?, ?)',
            [username, mainCharacter, hashedPassword, apiKey || null]
        );
        const newUserId = userResult.insertId;

        await connection.query(
            'INSERT INTO life_energy_trackers (user_id, character_name) VALUES (?, ?)',
            [newUserId, mainCharacter]
        );

        if (apiKey) {
            const { data: siblings } = await axios.get(`https://developer-lostark.game.onstove.com/characters/${mainCharacter}/siblings`, {
                headers: { 'authorization': `bearer ${apiKey}` }
            });

            const mainCharFromServer = siblings.find(c => c.CharacterName === mainCharacter);
            if (!mainCharFromServer) throw new Error('대표 캐릭터를 원정대에서 찾을 수 없습니다.');
            
            let sameServerChars = siblings.filter(c => c.ServerName === mainCharFromServer.ServerName);
            sameServerChars.sort((a, b) => parseFloat((b.ItemAvgLevel || '0').replace(/,/g, '')) - parseFloat((a.ItemAvgLevel || '0').replace(/,/g, '')));

            const [allRaids] = await connection.query('SELECT * FROM raids');

            for (const [index, char] of sameServerChars.entries()) {
                const itemLevel = parseFloat((char.ItemAvgLevel || '0').replace(/,/g, ''));
                const isGoldCharacter = index < 6;

                const [charInsertResult] = await connection.query(
                    'INSERT INTO characters (user_id, character_name, character_level, character_class, avatar_url, order_index, is_gold_character) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [newUserId, char.CharacterName, itemLevel, char.CharacterClassName, char.CharacterImage, index, isGoldCharacter]
                );
                const newCharId = charInsertResult.insertId;

                await connection.query('INSERT INTO daily_homework (character_id) VALUES (?)', [newCharId]);

                // [수정] 난이도 무관, 레벨이 가장 높은 레이드 1개만 선택하는 로직
                const eligibleRaids = allRaids.filter(raid => raid.entry_level <= itemLevel);
                const raidGroups = {};
                eligibleRaids.forEach(raid => {
                    if (!raidGroups[raid.raid_name] || raidGroups[raid.raid_name].entry_level < raid.entry_level) {
                        raidGroups[raid.raid_name] = raid;
                    }
                });
                
                const topRaids = Object.values(raidGroups)
                    .map(raid => ({ ...raid, totalGold: (JSON.parse(raid.gold_per_gate || '[]')).reduce((a, b) => a + b, 0) }))
                    .sort((a, b) => b.totalGold - a.totalGold)
                    .slice(0, 3);
                
                if (topRaids.length > 0) {
                    const raidsToInsert = topRaids.map(raid => [
                        newCharId, raid.id, JSON.stringify(Array(raid.gates).fill(false)), JSON.stringify(Array(raid.gates).fill(true))
                    ]);
                    await connection.query('INSERT INTO character_raids (character_id, raid_id, gate_progress, more_gold_checked) VALUES ?', [raidsToInsert]);
                }
            }
        }

        await connection.commit();
        res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.' });

    } catch (err) {
        await connection.rollback();
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: '이미 사용 중인 아이디입니다.' });
        }
        if (err.isAxiosError) {
            console.error("로스트아크 API 오류:", err.response?.data);
            return res.status(400).json({ message: '로스트아크 API 인증에 실패했습니다. API 키와 대표 캐릭터명을 확인해주세요.' });
        }
        console.error("회원가입 DB 오류:", err);
        res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
    } finally {
        connection.release();
    }
});

// 로그인 API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    }

    try {
        const [results] = await dbPool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (results.length === 0) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        }

        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
        res.status(200).json({
            message: '로그인 성공!',
            token,
            user: {
                username: user.username,
                mainCharacter: user.mainCharacter,
                apiKey: user.apiKey
            }
        });
    } catch (error) {
        console.error("로그인 오류:", error);
        res.status(500).json({ message: '로그인 중 서버 오류가 발생했습니다.' });
    }
});

// 회원정보 변경 업데이트
app.put('/api/user/update', verifyToken, async (req, res) => {
    const { newPassword, apiKey } = req.body;
    const userId = req.userId;
    
    let query;
    let params;

    if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        query = 'UPDATE users SET password = ?, apiKey = ? WHERE id = ?';
        params = [hashedPassword, apiKey, userId];
    } else {
        query = 'UPDATE users SET apiKey = ? WHERE id = ?';
        params = [apiKey, userId];
    }

    try {
        await dbPool.query(query, params);
        res.status(200).json({ message: '사용자 정보가 성공적으로 업데이트되었습니다.' });
    } catch (err) {
        res.status(500).json({ message: '정보 업데이트 중 오류 발생' });
    }
});

app.post('/api/validate-key', async (req, res) => {
    const { apiKey, characterName } = req.body;
    if (!apiKey || !characterName) {
        return res.status(400).json({ message: 'API 키와 대표 캐릭터명이 필요합니다.' });
    }
    try {
        await axios.get(`https://developer-lostark.game.onstove.com/characters/${characterName}/siblings`, {
            headers: { 'authorization': `bearer ${apiKey}` }
        });
        res.status(200).json({ message: 'API 키가 유효합니다.' });
    } catch (error) {
        res.status(401).json({ message: 'API 키가 유효하지 않거나 대표 캐릭터명이 잘못되었습니다.' });
    }
});

// 누구쇼
app.post('/api/characters/refresh', verifyToken, async (req, res) => {
    const userId = req.userId;
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        const [users] = await connection.query('SELECT mainCharacter, apiKey FROM users WHERE id = ?', [userId]);
        if (users.length === 0 || !users[0].apiKey) {
            throw new Error('API 키가 등록되지 않았습니다.');
        }
        const { mainCharacter, apiKey } = users[0];

        const apiResponse = await axios.get(`https://developer-lostark.game.onstove.com/characters/${mainCharacter}/siblings`, {
            headers: { 'authorization': `bearer ${apiKey}` }
        });
        const latestCharacters = apiResponse.data;

        const [dbCharacters] = await connection.query('SELECT character_name FROM characters WHERE user_id = ?', [userId]);
        const dbCharNames = dbCharacters.map(c => c.character_name);

        const newCharacters = latestCharacters.filter(char => !dbCharNames.includes(char.CharacterName));

        if (newCharacters.length > 0) {
            const charactersToSave = newCharacters.map(char => {
                const itemLevel = parseFloat((char.ItemMaxLevel || '0').replace(/,/g, ''));
                return [
                    userId,
                    char.CharacterName,
                    itemLevel,
                    char.CharacterClassName,
                    `https://placehold.co/48x48/cccccc/ffffff?text=${char.CharacterName.charAt(0)}`,
                    itemLevel >= 1600
                ];
            });
            await connection.query(
              'INSERT INTO characters (user_id, character_name, character_level, character_class, avatar_url, is_gold_character) VALUES ?',
              [charactersToSave]
            );
        }
        
        await connection.commit();
        res.status(200).json({ message: `${newCharacters.length}명의 신규 캐릭터를 추가했습니다.` });

    } catch (error) {
        await connection.rollback();
        console.error("캐릭터 갱신 오류:", error);
        res.status(500).json({ message: error.message || '캐릭터 목록 갱신 중 오류가 발생했습니다.' });
    } finally {
        connection.release();
    }
});

// 캐릭터 목록 조회 API
app.get('/api/characters', verifyToken, async (req, res) => {
    try {
        const [characters] = await dbPool.query('SELECT * FROM characters WHERE user_id = ? ORDER BY order_index ASC', [req.userId]);
        
        const characterPromises = characters.map(async (char) => {
            // 주간 레이드 정보 조회
            const [raids] = await dbPool.query(
                `SELECT r.id, r.raid_name, r.difficulty_name, r.gold_per_gate, r.more_gold_per_gate, cr.gate_progress, cr.more_gold_checked 
                 FROM character_raids cr 
                 JOIN raids r ON cr.raid_id = r.id 
                 WHERE cr.character_id = ?`,
                [char.id]
            );
            
            // 일일 숙제 정보 조회
            const [dailyHomework] = await dbPool.query('SELECT * FROM daily_homework WHERE character_id = ?', [char.id]);
            
            return {
                id: char.id,
                name: char.character_name,
                class: char.character_class,
                level: char.character_level,
                avatar: char.avatar_url,
                daily: {
                    kurzanRest: dailyHomework[0]?.kurzan_rest || 0,
                    guardianRest: dailyHomework[0]?.guardian_rest || 0,
                    kurzanDone: !!dailyHomework[0]?.kurzan_done,
                    guardianDone: !!dailyHomework[0]?.guardian_done,
                },
                settings: {
                    showWeekly: !!char.show_weekly,
                    showDaily: !!char.show_daily,
                    isGoldCharacter: !!char.is_gold_character,
                    isHidden: !!char.is_hidden
                },
                weeklyRaids: raids.map(raid => ({
                    raidId: raid.id.split('_')[0],
                    difficultyId: raid.id,
                    name: raid.raid_name,
                    difficultyName: raid.difficulty_name,
                    gates: JSON.parse(raid.gate_progress || '[]'),
                    gold: JSON.parse(raid.gold_per_gate || '[]'),
                    more_gold_per_gate: JSON.parse(raid.more_gold_per_gate || '[]'),
                    more_gold_checked: JSON.parse(raid.more_gold_checked || '[]')
                }))
            };
        });

        const fullCharacterData = await Promise.all(characterPromises);
        res.status(200).json(fullCharacterData);

    } catch (error) {
        console.error('캐릭터 정보 조회 오류:', error);
        res.status(500).json({ message: '캐릭터 정보를 불러오는 중 오류가 발생했습니다.' });
    }
});

// 캐릭터 순서 저장 API
app.post('/api/characters/reorder', verifyToken, async (req, res) => {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const promises = orderedIds.map((id, index) =>
            connection.query('UPDATE characters SET order_index = ? WHERE id = ? AND user_id = ?', [index, id, req.userId])
        );
        await Promise.all(promises);
        await connection.commit();
        res.status(200).json({ message: '캐릭터 순서가 저장되었습니다.' });
    } catch (error) {
        await connection.rollback();
        console.error('순서 저장 중 오류 발생:', error);
        res.status(500).json({ message: '순서 저장 중 오류 발생' });
    } finally {
        connection.release();
    }
});

// 레이드 목록
app.get('/api/raids', async (req, res) => {
    try {
        const [raidsFromDB] = await dbPool.query('SELECT * FROM raids ORDER BY entry_level DESC, id');

        // DB의 플랫 데이터를 프론트엔드가 사용하기 좋은 중첩 구조로 변환
        const raidMap = new Map();
        raidsFromDB.forEach(raid => {
            const idParts = raid.id.split('_');
            const difficulty = idParts.pop();
            const raidBaseId = idParts.join('_');

            if (!raidMap.has(raidBaseId)) {
                raidMap.set(raidBaseId, {
                    id: raidBaseId,
                    name: raid.raid_name,
                    difficulties: []
                });
            }

            raidMap.get(raidBaseId).difficulties.push({
                id: raid.id,
                name: raid.difficulty_name,
                gates: raid.gates,
                gold: JSON.parse(raid.gold_per_gate || '[]'),
                more_gold_per_gate: JSON.parse(raid.more_gold_per_gate || '[]')
            });
        });

        const allRaids = Array.from(raidMap.values());
        res.status(200).json(allRaids);
    } catch (error) {
        console.error('레이드 정보 조회 오류:', error);
        res.status(500).json({ message: '레이드 정보를 불러오는 중 오류가 발생했습니다.' });
    }
});

// 캐릭터 삭제 API
app.delete('/api/characters/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    try {
        const [rows] = await dbPool.query('SELECT user_id FROM characters WHERE id = ?', [id]);
        if (rows.length === 0 || rows[0].user_id !== userId) return res.status(403).json({ message: '권한이 없습니다.' });
        await dbPool.query('DELETE FROM characters WHERE id = ?', [id]);
        res.status(200).json({ message: '캐릭터가 삭제되었습니다.' });
    } catch (error) { res.status(500).json({ message: '캐릭터 삭제 중 오류 발생' }); }
});

// 캐릭터 설정 및 레이드 목록 업데이트 API
app.put('/api/characters/:id/settings', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { settings, raids } = req.body;
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        // [수정] 서버 측에서 중복 레이드(이름 기준) 검사
        if (raids && raids.length > 0) {
            const raidNames = raids.map(r => r.name);
            const uniqueRaidNames = new Set(raidNames);
            if (raidNames.length !== uniqueRaidNames.size) {
                await connection.rollback();
                return res.status(400).json({ message: '한 레이드는 하나의 난이도만 선택할 수 있습니다.' });
            }
        }

        await connection.query(
            'UPDATE characters SET is_gold_character = ?, is_hidden = ?, show_weekly = ?, show_daily = ? WHERE id = ? AND user_id = ?',
            [settings.isGoldCharacter, settings.isHidden, settings.showWeekly, settings.showDaily, id, req.userId]
        );
        
        await connection.query('DELETE FROM character_raids WHERE character_id = ?', [id]);
        
        if (raids && raids.length > 0) {
            const raidsToInsert = raids.map(raid => [
                id, raid.difficultyId, JSON.stringify(raid.gates), JSON.stringify(raid.more_gold_checked)
            ]);
            await connection.query('INSERT INTO character_raids (character_id, raid_id, gate_progress, more_gold_checked) VALUES ?', [raidsToInsert]);
        }
        
        await connection.commit();
        res.status(200).json({ message: '설정이 저장되었습니다.' });
    } catch (error) {
        await connection.rollback();
        console.error('설정 저장 오류:', error);
        res.status(500).json({ message: '설정 저장 중 오류 발생' });
    } finally {
        connection.release();
    }
});

// 주간 레이드 진행도 업데이트 API
app.put('/api/character-raids/:characterId/:raidId', verifyToken, async (req, res) => {
    const { characterId, raidId } = req.params;
    const { gate_progress } = req.body;
    try {
        // [수정] 순차적 클리어/해제 검증 로직 강화
        const firstUnchecked = gate_progress.indexOf(false);
        const lastChecked = gate_progress.lastIndexOf(true);

        if (firstUnchecked !== -1 && lastChecked > firstUnchecked) {
            return res.status(400).json({ message: '관문은 순서대로 진행해야 합니다.' });
        }

        await dbPool.query(
            'UPDATE character_raids SET gate_progress = ? WHERE character_id = ? AND raid_id = ?',
            [JSON.stringify(gate_progress), characterId, raidId]
        );
        res.status(200).json({ message: '레이드 진행도가 저장되었습니다.' });
    } catch (error) {
        console.error('레이드 진행도 저장 오류:', error);
        res.status(500).json({ message: '레이드 진행도 저장 중 오류가 발생했습니다.' });
    }
});

// 주간 레이드 전체 클리어/초기화 API
app.post('/api/character-raids/:characterId/:raidId/toggle-all', verifyToken, async (req, res) => {
    const { characterId, raidId } = req.params;
    const { complete } = req.body; // true: 전체 클리어, false: 전체 초기화
    
    const connection = await dbPool.getConnection();
    try {
        const [raidInfo] = await connection.query('SELECT r.gates FROM character_raids cr JOIN raids r ON cr.raid_id = r.id WHERE cr.character_id = ? AND cr.raid_id = ?', [characterId, raidId]);
        
        if (raidInfo.length === 0) {
            return res.status(404).json({ message: '해당 레이드를 찾을 수 없습니다.' });
        }
        
        const gatesCount = raidInfo[0].gates;
        const newGateProgress = Array(gatesCount).fill(complete);

        await connection.query(
            'UPDATE character_raids SET gate_progress = ? WHERE character_id = ? AND raid_id = ?',
            [JSON.stringify(newGateProgress), characterId, raidId]
        );
        res.status(200).json({ message: `레이드가 전체 ${complete ? '완료' : '초기화'} 처리되었습니다.` });
    } catch (error) {
        console.error('레이드 전체 토글 오류:', error);
        res.status(500).json({ message: '레이드 전체 처리 중 오류 발생' });
    } finally {
        connection.release();
    }
});

// 일일 숙제 업데이트 API
app.put('/api/characters/:characterId/daily', verifyToken, async (req, res) => {
    const { characterId } = req.params;
    const { daily } = req.body;
    try {
        // DB의 현재 값을 먼저 조회하여, 요청에 값이 없는 경우 기존 값을 유지하도록 함
        const [[currentDaily]] = await dbPool.query('SELECT * FROM daily_homework WHERE character_id = ?', [characterId]);

        if (!currentDaily) {
            return res.status(404).json({ message: '해당 캐릭터의 일일 숙제 데이터를 찾을 수 없습니다.' });
        }

        // 요청 본문에 해당 키가 있으면 그 값을 사용하고, 없으면 DB의 현재 값을 사용
        const kurzanDone = daily.kurzanDone ?? currentDaily.kurzan_done;
        const guardianDone = daily.guardianDone ?? currentDaily.guardian_done;
        const kurzanRest = daily.kurzanRest ?? currentDaily.kurzan_rest;
        const guardianRest = daily.guardianRest ?? currentDaily.guardian_rest;

        await dbPool.query(
            'UPDATE daily_homework SET kurzan_done = ?, guardian_done = ?, kurzan_rest = ?, guardian_rest = ? WHERE character_id = ?',
            [kurzanDone, guardianDone, kurzanRest, guardianRest, characterId]
        );
        res.status(200).json({ message: '일일 숙제가 저장되었습니다.' });
    } catch (error) {
        console.error('일일 숙제 저장 오류:', error);
        res.status(500).json({ message: '일일 숙제 저장 중 오류가 발생했습니다.' });
    }
});

// 생활의 기운 처음 추가
app.get('/api/life-energy', verifyToken, async (req, res) => {
    try {
        const [trackers] = await dbPool.query('SELECT * FROM life_energy_trackers WHERE user_id = ? ORDER BY id ASC', [req.userId]);
        res.status(200).json(trackers);
    } catch (error) {
        res.status(500).json({ message: '데이터 조회 중 오류 발생' });
    }
});

// 생활의 기운 부계정 추가
app.post('/api/life-energy', verifyToken, async (req, res) => {
    const { character_name } = req.body;
    try {
        const [result] = await dbPool.query(
            'INSERT INTO life_energy_trackers (user_id, character_name) VALUES (?, ?)',
            [req.userId, character_name || '새 캐릭터']
        );
        const [[newTracker]] = await dbPool.query('SELECT * FROM life_energy_trackers WHERE id = ?', [result.insertId]);
        res.status(201).json(newTracker);
    } catch (error) {
        res.status(500).json({ message: '데이터 추가 중 오류 발생' });
    }
});

// 생활의 기운 부계정 생활의 기운 업데이트
app.put('/api/life-energy/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { character_name, energy, max_energy, has_beatrice_blessing } = req.body;
    try {
        await dbPool.query(
            'UPDATE life_energy_trackers SET character_name = ?, energy = ?, max_energy = ?, has_beatrice_blessing = ? WHERE id = ? AND user_id = ?',
            [character_name, energy, max_energy, has_beatrice_blessing, id, req.userId]
        );
        res.status(200).json({ message: '트래커가 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '데이터 업데이트 중 오류 발생' });
    }
});

// 생활의 기운 부계정 삭제
app.delete('/api/life-energy/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await dbPool.query('DELETE FROM life_energy_trackers WHERE id = ? AND user_id = ?', [id, req.userId]);
        res.status(200).json({ message: '트래커가 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '데이터 삭제 중 오류 발생' });
    }
});

// 모험섬
app.get('/api/lostark/contents', async (req, res) => {
    if (!LOSTARK_API_KEY) {
        return res.status(503).json({ message: '서버에 API 키가 설정되지 않았습니다.' });
    }
    try {
        const response = await axios.get('https://developer-lostark.game.onstove.com/gamecontents/calendar', {
            headers: { 
                'accept': 'application/json',
                'authorization': `bearer ${LOSTARK_API_KEY}`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("콘텐츠 캘린더 조회 오류:", error.response?.data || error.message);
        if (error.response?.status === 401) {
             return res.status(401).json({ message: '서버의 API 키가 유효하지 않습니다.' });
        }
        res.status(500).json({ message: '콘텐츠 캘린더를 불러오는 중 오류가 발생했습니다.' });
    }
});

// [수정] 로스트아크 공지사항 (공식 API 사용)
app.get('/api/lostark/notices', async (req, res) => {
    if (!LOSTARK_API_KEY) {
        return res.status(503).json({ message: '서버에 API 키가 설정되지 않았습니다.' });
    }
    try {
        const response = await axios.get('https://developer-lostark.game.onstove.com/news/notices', {
            headers: {
                'accept': 'application/json',
                'authorization': `bearer ${LOSTARK_API_KEY}`
            }
        });

        // API 응답 데이터 (최신 5개)를 프론트엔드가 사용하기 좋은 형식으로 가공
        const notices = response.data.slice(0, 5).map((item, index) => ({
            id: index,
            category: item.Type,
            title: item.Title,
            date: new Date(item.Date).toISOString().split('T')[0].replace(/-/g, '.'), // "2025-08-22" -> "2025.08.22"
            link: item.Link,
        }));

        res.status(200).json(notices);
    } catch (error) {
        console.error("공지사항 API 오류:", error.response?.data || error.message);
        res.status(500).json({ message: '공지사항을 불러오는 중 오류가 발생했습니다.' });
    }
});


const PORT = 8000;
app.listen(PORT, () => {
  console.log(`백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});