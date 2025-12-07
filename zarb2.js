document.addEventListener('DOMContentLoaded', function () {
    // Utility Functions
    function toPersianNum(num) { 
        if (num === null || num === undefined) return ''; 
        return num.toString().replace(/d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]); 
    }
    function toEnglishNum(numStr) { 
        if (!numStr) return ''; 
        return numStr.toString().replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]).trim(); 
    }

    // تبدیل خودکار ورودی‌های کاربر به فارسی هنگام تایپ
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let val = e.target.value;
            let persianVal = toPersianNum(toEnglishNum(val));
            if(val !== persianVal) {
                e.target.value = persianVal;
            }
        });
    });

    // Variables
    var a, b, aTens, aOnes, bTens, bOnes, correctTT, correctTO, correctOT, correctOO;
    var coins = 10;
    var buildingNumber = 1;
    
    // Data
    var buildings = [ {icon: '🏠', name: 'خانه کوچک'}, {icon: '🏡', name: 'خانه حیاط‌دار'}, {icon: '🏢', name: 'برج شیشه‌ای'}, {icon: '🏬', name: 'مرکز خرید'}, {icon: '🏫', name: 'مدرسه ریاضی'}, {icon: '🏰', name: 'قلعه عددها'}, {icon: '🏨', name: 'هتل ستاره‌دار'}, {icon: '🏛️', name: 'کاخ اعداد'}, {icon: '🏗️', name: 'برج آسمان'} ];
    var districts = [ {emoji: '🏘️', name: 'محله مبتدی‌ها'}, {emoji: '🏙️', name: 'خیابان ماهرها'}, {emoji: '🌆', name: 'بلوار استادها'}, {emoji: '🌉', name: 'پل طلایی'}, {emoji: '🏛️', name: 'قصر نهایی'} ];

    function getSolvedBuildings() { return Math.max(0, buildingNumber - 1); }

    function updateDashboard() {
        var solved = getSolvedBuildings();
        var stars = Math.floor(solved / 5);
        document.getElementById('building-number').textContent = toPersianNum(solved);
        document.getElementById('coins').textContent = toPersianNum(coins);
        document.getElementById('stars').textContent = toPersianNum(stars);
        
        var levelIndex = Math.min(Math.floor(solved / 5), districts.length - 1);
        var district = districts[levelIndex];
        
        document.getElementById('district-emoji').textContent = district.emoji;
        document.getElementById('district-name').textContent = district.name;
        
        var inLevelSolved = solved % 5;
        document.getElementById('progress-bar').style.width = `${(inLevelSolved / 5) * 100}%`;
        document.getElementById('progress-text').textContent = `${toPersianNum(inLevelSolved)}/۵`;
        
        document.body.className = `level-${Math.min(levelIndex + 1, 5)}`;
        
        var bIndex = solved % buildings.length;
        document.getElementById('current-building').textContent = buildings[bIndex].icon;
        document.getElementById('building-name').textContent = buildings[bIndex].name;
    }

    function updateProblemUI() {
        aTens = Math.floor(a / 10) * 10; aOnes = a % 10;
        bTens = Math.floor(b / 10) * 10; bOnes = b % 10;
        correctTT = aTens * bTens; correctTO = aTens * bOnes; correctOT = aOnes * bTens; correctOO = aOnes * bOnes;

        const setTexts = (ids, val) => ids.forEach(id => { if(document.getElementById(id)) document.getElementById(id).textContent = toPersianNum(val); });
        setTexts(['v-a-top', 'process-v-a-top', 'trick-v-a-top', 'a-value'], a);
        setTexts(['v-b-top', 'process-v-b-top', 'trick-v-b-top', 'b-value'], b);

        document.querySelectorAll('input[type="text"]').forEach(inp => { inp.value = ''; inp.classList.remove('input-hinted'); });
        document.getElementById('check-step2').disabled = true;
        document.getElementById('check-step3').disabled = true;

        ['rect-tt','rect-to','rect-ot','rect-oo'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.textContent = ''; el.classList.remove('visible', 'blinking'); }
        });
        
        ['col-tens', 'col-ones', 'row-tens', 'row-ones', 'label-tt', 'label-to', 'label-ot', 'label-oo'].forEach(id => {
            if(document.getElementById(id)) document.getElementById(id).textContent = '';
        });

        document.getElementById('process-formula-question').innerHTML = `( ${toPersianNum(aTens)} + ${toPersianNum(aOnes)} ) × ( ${toPersianNum(bTens)} + ${toPersianNum(bOnes)} )`;
        
        document.getElementById('trick-hint-1').textContent = `(${toPersianNum(bOnes)} × ${toPersianNum(a)})`;
        document.getElementById('trick-hint-2').textContent = `(${toPersianNum(bTens)} × ${toPersianNum(a)})`;
        
        // Graphic logic
        var totalH = aTens + aOnes; var totalW = bTens + bOnes;
        var rowT_raw = totalH > 0 ? (aTens / totalH) * 100 : 50;
        var colT_raw = totalW > 0 ? (bTens / totalW) * 100 : 50;

        var rowT = Math.max(30, Math.min(70, rowT_raw));
        var colT = Math.max(30, Math.min(70, colT_raw));

        var ag = document.getElementById('area-graphic');
        ag.style.gridTemplateRows = `${rowT}% auto`;
        ag.style.gridTemplateColumns = `${colT}% auto`;

        document.querySelectorAll('.msg').forEach(el => { el.textContent = ''; el.className = 'msg'; el.style.display = 'none'; });
    }

    function generateRandomProblem() {
        var levelIndex = Math.floor(getSolvedBuildings() / 5);
        var min = (levelIndex === 0) ? 10 : (levelIndex === 1) ? 20 : 15;
        var max = (levelIndex === 0) ? 30 : (levelIndex === 1) ? 50 : 99;
        a = Math.floor(Math.random() * (max - min + 1)) + min;
        b = Math.floor(Math.random() * (max - min + 1)) + min;
        updateProblemUI();
    }

    function useHint(inputsToFill) {
        if (coins < 10) { alert('سکه کافی نیست! برای گرفتن راهنما به ۱۰ سکه نیاز داری.'); return; }
        coins -= 10;
        updateDashboard();
        inputsToFill.forEach(item => {
            var el = document.getElementById(item.id);
            if (el) {
                el.value = toPersianNum(item.val);
                el.classList.add('input-hinted');
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }

    // Event Listeners
    document.getElementById('hint-area-btn').addEventListener('click', function() {
        useHint([
            {id: 'a-tens', val: aTens}, {id: 'a-ones', val: aOnes},
            {id: 'b-tens', val: bTens}, {id: 'b-ones', val: bOnes},
            {id: 'cell-tt', val: correctTT}, {id: 'cell-to', val: correctTO},
            {id: 'cell-ot', val: correctOT}, {id: 'cell-oo', val: correctOO},
            {id: 'sum-partials', val: (correctTT + correctTO + correctOT + correctOO)},
            {id: 'final-product', val: a * b}
        ]);
        document.getElementById('check-step1').click();
        document.getElementById('check-step2').disabled = false;
        document.getElementById('check-step3').disabled = false;
    });

    document.getElementById('hint-process-btn').addEventListener('click', () => useHint([{id: 'proc-tt', val: correctTT}, {id: 'proc-to', val: correctTO}, {id: 'proc-ot', val: correctOT}, {id: 'proc-oo', val: correctOO}, {id: 'proc-total', val: a * b}]));
    document.getElementById('hint-trick-btn').addEventListener('click', () => useHint([{id: 'trick-p1-input', val: a * bOnes}, {id: 'trick-p2-input', val: a * bTens}, {id: 'trick-total-input', val: a * b}]));

    function showMsg(id, success, text) {
        var el = document.getElementById(id);
        el.textContent = text;
        el.className = success ? 'msg ok' : 'msg err';
        el.style.display = 'block';
    }

    function handleSuccess(msgId, msgText) {
        showMsg(msgId, true, msgText);
        coins += 5;
        buildingNumber++;
        updateDashboard();
        document.getElementById(msgId).scrollIntoView({behavior: 'smooth', block: 'nearest'});
        setTimeout(generateRandomProblem, 3000);
    }

    document.getElementById('check-step1').addEventListener('click', function() {
        var at = parseInt(toEnglishNum(document.getElementById('a-tens').value)) || 0; var ao = parseInt(toEnglishNum(document.getElementById('a-ones').value)) || 0;
        var bt = parseInt(toEnglishNum(document.getElementById('b-tens').value)) || 0; var bo = parseInt(toEnglishNum(document.getElementById('b-ones').value)) || 0;
        if (at === aTens && ao === aOnes && bt === bTens && bo === bOnes) {
            showMsg('msg-step1', true, 'آفرین! گسترده کردن اعداد درست است.');
            document.getElementById('col-tens').textContent = toPersianNum(bTens); document.getElementById('col-ones').textContent = toPersianNum(bOnes);
            document.getElementById('row-tens').textContent = toPersianNum(aTens); document.getElementById('row-ones').textContent = toPersianNum(aOnes);
            document.getElementById('label-tt').textContent = `${toPersianNum(aTens)}×${toPersianNum(bTens)}`; document.getElementById('label-to').textContent = `${toPersianNum(aTens)}×${toPersianNum(bOnes)}`;
            document.getElementById('label-ot').textContent = `${toPersianNum(aOnes)}×${toPersianNum(bTens)}`; document.getElementById('label-oo').textContent = `${toPersianNum(aOnes)}×${toPersianNum(bOnes)}`;
            document.getElementById('check-step2').disabled = false;
        } else { showMsg('msg-step1', false, 'دقت کن! دهگان و یکان را بررسی کن.'); }
    });

    document.getElementById('check-step2').addEventListener('click', function() {
        var tt = parseInt(toEnglishNum(document.getElementById('cell-tt').value)) || 0; var to = parseInt(toEnglishNum(document.getElementById('cell-to').value)) || 0;
        var ot = parseInt(toEnglishNum(document.getElementById('cell-ot').value)) || 0; var oo = parseInt(toEnglishNum(document.getElementById('cell-oo').value)) || 0;
        if (tt === correctTT && to === correctTO && ot === correctOT && oo === correctOO) {
            showMsg('msg-step2', true, 'فوق‌العاده! همه مساحت‌ها صحیح هستند.');
            document.getElementById('check-step3').disabled = false;
        } else { showMsg('msg-step2', false, 'اشتباه داری. ضرب سطر در ستون را چک کن.'); }
    });

    document.getElementById('check-step3').addEventListener('click', () => {
        var sum = parseInt(toEnglishNum(document.getElementById('sum-partials').value)) || 0; var finalP = parseInt(toEnglishNum(document.getElementById('final-product').value)) || 0;
        if (sum === (correctTT + correctTO + correctOT + correctOO) && finalP === (a * b)) { handleSuccess('msg-step3', 'تبریک! ساختمان ساخته شد! 🏠 (+۵ سکه)'); } 
        else { showMsg('msg-step3', false, 'جمع نهایی یا حاصل‌ضرب اشتباه است.'); }
    });

    document.getElementById('check-process').addEventListener('click', () => {
        var parts = [
            parseInt(toEnglishNum(document.getElementById('proc-tt').value))||0, 
            parseInt(toEnglishNum(document.getElementById('proc-to').value))||0, 
            parseInt(toEnglishNum(document.getElementById('proc-ot').value))||0, 
            parseInt(toEnglishNum(document.getElementById('proc-oo').value))||0
        ];
        var total = parseInt(toEnglishNum(document.getElementById('proc-total').value)) || 0;
        var corrects = [correctTT, correctTO, correctOT, correctOO];
        parts.sort((x,y)=>x-y);
        corrects.sort((x,y)=>x-y);
        if (JSON.stringify(parts) === JSON.stringify(corrects) && total === (a*b)) { 
            handleSuccess('msg-process', 'عالی! ضرب فرآیندی کامل شد. 🏗️ (+۵ سکه)'); 
        } else { 
            showMsg('msg-process', false, 'اعداد داخل کادرها یا جمع نهایی را بررسی کن.'); 
        }
    });

    document.getElementById('check-trick').addEventListener('click', () => {
        var r1 = parseInt(toEnglishNum(document.getElementById('trick-p1-input').value)) || 0; 
        var r2 = parseInt(toEnglishNum(document.getElementById('trick-p2-input').value)) || 0; 
        var t = parseInt(toEnglishNum(document.getElementById('trick-total-input').value)) || 0;
        if (r1 === (a * bOnes) && r2 === (a * bTens) && t === (a * b)) { 
            handleSuccess('msg-trick', 'سریع و دقیق! ⚡ (+۵ سکه)'); 
        } else { 
            showMsg('msg-trick', false, 'دقت کن! ضرب طبقه اول یا دوم اشتباه است.'); 
        }
    });

    function setupAreaInputListeners() {
        const checkAndUpdateRect = (inputId, rectId, getCorrectValue) => {
            const inputEl = document.getElementById(inputId);
            const rectEl = document.getElementById(rectId);
            inputEl.addEventListener('focus', () => { rectEl.classList.add('blinking'); });
            inputEl.addEventListener('blur', () => { rectEl.classList.remove('blinking'); });
            inputEl.addEventListener('input', (e) => {
                const userValue = parseInt(toEnglishNum(e.target.value)) || 0;
                if (userValue === getCorrectValue()) {
                    rectEl.textContent = toPersianNum(userValue);
                    rectEl.classList.add('visible');
                    rectEl.classList.remove('blinking');
                } else {
                    rectEl.classList.remove('visible');
                }
            });
        };
        checkAndUpdateRect('cell-tt', 'rect-tt', () => correctTT); checkAndUpdateRect('cell-to', 'rect-to', () => correctTO);
        checkAndUpdateRect('cell-ot', 'rect-ot', () => correctOT); checkAndUpdateRect('cell-oo', 'rect-oo', () => correctOO);
    }

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.method-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('method-' + btn.dataset.mode).classList.add('active');
        });
    });

    document.getElementById('new-problem-btn').addEventListener('click', generateRandomProblem);
    
    document.getElementById('apply-custom-btn').addEventListener('click', () => {
        var va = parseInt(toEnglishNum(document.getElementById('custom-a').value)); 
        var vb = parseInt(toEnglishNum(document.getElementById('custom-b').value));
        if(!isNaN(va) && !isNaN(vb) && va > 9 && vb > 9) {
            a = va; b = vb;
            updateProblemUI();
            document.querySelector('details').removeAttribute('open');
        } else {
            alert('لطفا اعداد دو رقمی وارد کنید');
        }
    });

    // فراخوانی تابع لیسنرها
    setupAreaInputListeners();

    generateRandomProblem();
});