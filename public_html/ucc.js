/* 暗黙のデータ型について
 * hue_id : 'hue2_5_R'などの文字列。詳細はgetHueIDListの定義を参照。
 * taste_id : '01cut'などの文字列。詳細はgetTasteJSONの定義を参照。
 * munsell_json : {color:"#e5e5e5", v:9,c:0}など。詳細はgetMunsellJSONの定義を参照。 
 */


function ColorInfo() {
    this.v = 0;
    this.c = 0;
    this.hex = '';
    this.hue_id = ''; 
}

/****************************
 * 色情報文字列関連
 ****************************/

/**
 * 色情報エリアに色相番号を表示
 * @param {String} hue_id
 */
function showHueString(hue_id) {
	var tag = document.getElementById("huename");
	var hue_str = hue_id.replace(/_/, ".");
	var hue_str = hue_str.replace(/hue([0-9]+)(.[0-9])*.([A-Z])/,"$1$2$3");
	tag.title = hue_id;
	tag.lastChild.nodeValue = hue_str;		
}

/**
 * 色情報エリアにマンセル値を表示
 * @param {String} colorcell_id
 */
function showHVCStr(colorcell_id) {
	removeElement('hvc_str');
	var c_cell_tag = document.getElementById(colorcell_id);
	var hvc_str_tag = document.getElementById('hvc_str');
	if (c_cell_tag === null || hvc_str_tag === null) { return null; }
	var hvc_strs = c_cell_tag.title.split(',');
	var munsell = hvc_strs[0];
	var rgb_hex = hvc_strs[1];
	var axis = '';
	if (colorcell_id.match(/^gp/)) {
		axis = colorcell_id.split('_');
		var axis_x = axis[0].replace(/[a-z]/g, '');
		var axis_y = axis[1].replace(/[a-z]/g, '');
		var axis_str = '(' + axis_x + ', ' + axis_y + ')';
		var tastename = getTasteNamefromAxis(axis_str);
		addDivTag('hvc_str', '', 'axis_str', axis_str + ' / ' + tastename);
	}
	addDivTag('hvc_str', '', 'munsell_str', 'munsell: ' + hvc_strs[0]);
	addDivTag('hvc_str', '', 'rgb_hex_str', 'RGB: ' + hvc_strs[1]);
}

/**
 * 色相・明度・彩度から色情報文字列を生成（H V/C）
 * @param {String} hue_id
 * @param {NUmber} v
 * @param {Number} c
 * @returns {String}
 */
function getMunsellString(hue_id, v, c) {
	var hue_str = getHueString(hue_id);
	return hue_str + ' ' + v + '/' +c;
}

/**
 * hue_idから表示用色相文字列を生成（例：hue2_5_R → 2.5R）
 * @param {String} hue_id
 * @returns {String}
 */
function getHueString(hue_id) {
	var hue_str = hue_id.replace(/_/, ".");
	return hue_str.replace(/hue([0-9]+)(.[0-9])*.([A-Z])/,"$1$2$3");
}

/****************************
 * マンセルカラーチャート関連
 ****************************/

/**
 * マンセルカラーチャート描画
 * @param {String} hue_id
 */
function drawColorChart(hue_id) {
	var munsell_json = getMunsellJSON(hue_id);
	removeElement("colorchart");
	var hue_str = hue_id.replace(/_/, ".");
	var hue_str = hue_str.replace(/hue([0-9]+)(.[0-9])*.([A-Z])/,"$1$2$3");
	for(var i in munsell_json) {
		var position = getMunsellCellPosition(munsell_json[i].v, munsell_json[i].c);
		var cell_id = "vc" + munsell_json[i].v + "_" + munsell_json[i].c;
		var tip = hue_str + ' ' + munsell_json[i].v + "/" + munsell_json[i].c + ', ' + munsell_json[i].color;
		addDivTag("colorchart",  "colorcell", cell_id, "");
		addTooltip(cell_id, tip);
		addColorAndPosiotionToCell(cell_id, munsell_json[i].color, position[0], position[1]);
	}
}

/**
 * vとcの値からマンセルカラーチャートのセル位置を返す
 * @param {Number} v
 * @param {Number} c
 * @returns {Number|Array}
 */
function getMunsellCellPosition(v, c) {
	var cp = [
	[0,0],[55,0],[110,0],[165,0],[220,0],[275,0],[330,0],[385,0],[440,0],[495,0],[550,0],[605,0],
[0,55],[55,55],[110,55],[165,55],[220,55],[275,55],[330,55],[385,55],[440,55],[495,55],[550,55],[605,55],
[0,110],[55,110],[110,110],[165,110],[220,110],[275,110],[330,110],[385,110],[440,110],[495,110],[550,110],[605,110],
[0,165],[55,165],[110,165],[165,165],[220,165],[275,165],[330,165],[385,165],[440,165],[495,165],[550,165],[605,165],
[0,220],[55,220],[110,220],[165,220],[220,220],[275,220],[330,220],[385,220],[440,220],[495,220],[550,220],[605,220],
[0,275],[55,275],[110,275],[165,275],[220,275],[275,275],[330,275],[385,275],[440,275],[495,275],[550,275],[605,275],
[0,330],[55,330],[110,330],[165,330],[220,330],[275,330],[330,330],[385,330],[440,330],[495,330],[550,330],[605,330],
[0,385],[55,385],[110,385],[165,385],[220,385],[275,385],[330,385],[385,385],[440,385],[495,385],[550,385],[605,385],
[0,440],[55,440],[110,440],[165,440],[220,440],[275,440],[330,440],[385,440],[440,440],[495,440],[550,440],[605,440]
	];

	var px = c / 2;
	var py = Math.abs(v - 9);	
	var i = px + 12 * py;

	return [cp[i][0], cp[i][1]];
}

/**
 * [Utility] マンセルカラーチャートの枠だけを描く
 * @param {type} hue_id
 * @returns {undefined}
 */
function drawColorChartFrame(hue_id) {
	var munsell_json = getMunsellJSON(hue_id);
	removeElement("colorchart");
	for(var i in munsell_json) {
		var position = getMunsellCellPosition(munsell_json[i].v, munsell_json[i].c);
		var cell_id = "frame_vc" + munsell_json[i].v + "_" + munsell_json[i].c;
		addDivTag("filled_colorchart",  "colorcellframe", cell_id, "");
		var ch = document.getElementById(cell_id);
		if (ch === null) { return; }					
		ch.style.left = position[0] + "px";
		ch.style.top = position[1] + "px";
	}
}

/****************************
 * カラーグローブエリア描画関連
 ****************************/

/**
 * カラーグローブcanvas描画
 */
function drawColorGlobeLines() {
 	var ring ={x:165, y:165, radius:150};
 	var ring_a = {x:165, y:387, radius:297};
 	var ring_b = {x:165, y:-57, radius:297};
 	
 	var x_axis = {fx:15, fy:165, tx:315, ty:165};
 	var y_axis = {fx:165, fy:0, tx:165, ty:315};
 	var mconst = 1.8;
 	
	var canvas = document.getElementById("colorglobe_canvas");
	var context = canvas.getContext("2d");

	context.beginPath();
	context.arc(ring.x*mconst, ring.y*mconst, ring.radius*mconst, 0, Math.PI * 2, false);
	context.lineWidth = 2;
	context.strokeStyle = "#999";
	context.stroke();
	context.beginPath();
	context.moveTo(x_axis.fx*mconst, x_axis.fy*mconst);
	context.lineTo(x_axis.tx*mconst, x_axis.ty*mconst);
	context.moveTo(y_axis.fx*mconst, y_axis.fy*mconst);
	context.lineTo(y_axis.tx*mconst, y_axis.ty*mconst);
	context.stroke();
	context.beginPath();
	context.arc(ring_a.x*mconst, ring_a.y*mconst, ring_a.radius*mconst, Math.PI * 4 / 3, Math.PI *5 / 3, false);
	context.stroke();
	context.beginPath();
	context.arc(ring_b.x*mconst, ring_b.y*mconst, ring_b.radius*mconst, Math.PI / 3 , Math.PI * 2 / 3, false);
	context.stroke();
}

/**
 * カラーグローブのカラーセル描画
 * @param {String} hue_id
 */
function drawGlobe3(hue_id) {
	removeElement("colorglobe");	
	var taste_json = getTasteJSON();
	for (var i=0; i<taste_json.length; i++) {
		var taste_id = taste_json[i].taste_id;
		drawGlobeCell(hue_id, taste_id);
	}
}

/**
 * カラーグローブの各セルを描画
 * @param {String} hue_id
 * @param {String} taste_id
 */
function drawGlobeCell(hue_id, taste_id) {
	var position = getCellPositionByTasteIdOnGlobe(taste_id);
	var color_info = getColorByTasteId(hue_id, taste_id);	
	var cell_id = 'cg' + hue_id + '_' + taste_id;
	var title_str = getMunsellString(hue_id, color_info.v, color_info.c) + ', ' + color_info.hex;
	/* addDivTag("colorglobe", "globecell", cell_id, title_str);  */
	addDivTag("colorglobe", "globecell", cell_id, '');
	var ch = document.getElementById(cell_id);
	if (ch === null) { return; }					
	ch.style.left = position[0] + "px";
	ch.style.top = position[1] + "px";	
	ch.title = title_str;
	ch.style.background = color_info.hex;
}

/**
 * カラーグローブ座標からテイスト名を取得
 * @param {String} axis '(3, -1)'など
 * @returns {String}
 */
function getTasteNamefromAxis(axis) {

	var taste_json = getTasteJSON();

	for (var i in taste_json) {
		var str = taste_json[i].axis;
		if (taste_json[i].axis === axis) {
			return taste_json[i].taste;
		}
	}
	return '';
}

/**
 * グローブ座標からセル位置を返す
 * @param {Number} gx
 * @param {Number} gy
 * @returns {Number|Array}
 */
function getCellPositionOnGlobe(gx, gy) {
	
	if (!(gx <= 3 && gx >= -3 && gy <= 2 && gy >= -2)) {
		return null;
	}

	/* グローブ座標(3, -2), (3, 2), (-3, -2) (-3, 2) は本来存在しないが、仮に[0, 0]を入れておく*/
	var cp = [[0,0],[50,40],[100,10],[150,0],[200,10],[250,40],[0,0],[5,110],[50,90],[100,80],[150,75],[200,80],[250,90],[295,110],[0,150],[50,150],[100,150],[150,150],[200,150],[250,150],[300,150],[5,190],[50,210],[100,220],[150,225],[200,220],[250,210],[295,190],[0,0],[50, 260],[100,290],[150,300],[200,290],[250,260],[0,0]];

	var i = Math.abs(gx - 3) + 7 * (gy + 2);
	if (cp[i][0] === 0 && cp[i][1] === 0) {
		return null;
	}
	
	return [cp[i][0]*1.8, cp[i][1]*1.8]; 
}

/**
 * テイストIDからカラーグローブのセル位置を返す
 * @param {String} taste_id
 * @returns {Number|Array}
 */
function getCellPositionByTasteIdOnGlobe(taste_id) {
	var axis = getAxisByTasteIdOnGlobe(taste_id);
	if (axis === null) { return null; }
	var match_result = axis.match(/([0-9¥-]+), ([0-9¥-]+)/);	
	return getCellPositionOnGlobe(parseInt(match_result[1]), parseInt(match_result[2]));
}

/**
 * テイストIDからグローブ座標を返す
 * @param {String} taste_id
 * @returns {Number|Array}
 */
function getAxisByTasteIdOnGlobe(taste_id) {
	var taste_json = getTasteJSON();
	for (var i=0; i<taste_json.length; i++) {
		if (taste_json[i].taste_id === taste_id) {
			return taste_json[i].axis;
		}
	}
	return null;
}

/*
 * テイスト名、テイストID、カラーグローブのセルID、カラーグローブ座標のリストを取得
 * @returns {taste_json|Array}
 */
function getTasteJSON() {
	return [{cell_id: 'gp3_-1', axis: '(3, -1)', taste: 'sporty+', taste_id: '10spo+'}, {cell_id: 'gp3_0', axis: '(3, 0)', taste: 'sporty', taste_id: '10spo'}, {cell_id: 'gp3_1', axis: '(3, 1)', taste: 'sporty-', taste_id: '10spo-'}, {cell_id: 'gp2_-2', axis: '(2, -2)', taste: 'clear sporty', taste_id: '05cls'}, {cell_id: 'gp2_-1', axis: '(2, -1)', taste: 'casual+', taste_id: '11cas+'}, {cell_id: 'gp2_0', axis: '(2, 0)', taste: 'casual', taste_id: '11cas'}, {cell_id: 'gp2_1', axis: '(2, 1)', taste: 'casual-', taste_id: '11cas-'}, {cell_id: 'gp2_2', axis: '(2, 2)', taste: 'dynamic', taste_id: '15dyn'}, {cell_id: 'gp1_-2', axis: '(1, -2)', taste: 'cute', taste_id: '01cut'}, {cell_id: 'gp1_-1', axis: '(1, -1)', taste: 'soft casual', taste_id: '06sca'}, {cell_id: 'gp1_0', axis: '(1, 0)', taste: 'traditional', taste_id: '12tra'}, {cell_id: 'gp1_1', axis: '(1, 1)', taste: 'ethnic', taste_id: '16eth'}, {cell_id: 'gp1_2', axis: '(1, 2)', taste: 'wild', taste_id: '19wld'}, {cell_id: 'gp0_-2', axis: '(0, -2)', taste: 'romantic', taste_id: '02rom'}, {cell_id: 'gp0_-1', axis: '(0, -1)', taste: 'feminine', taste_id: '07fem'}, {cell_id: 'gp0_0', axis: '(0, 0)', taste: 'natural', taste_id: '13nat'}, {cell_id: 'gp0_1', axis: '(0, 1)', taste: 'classic', taste_id: '17cla'}, {cell_id: 'gp0_2', axis: '(0, 2)', taste: 'dandy', taste_id: '20dan'}, {cell_id: 'gp-1_-2', axis: '(-1, -2)', taste: 'noble', taste_id: '03nob'}, {cell_id: 'gp-1_-1', axis: '(-1, -1)', taste: 'soft elegant', taste_id: '08sel'}, {cell_id: 'gp-1_0', axis: '(-1, 0)', taste: 'natural+', taste_id: '13nat+'}, {cell_id: 'gp-1_1', axis: '(-1, 1)', taste: 'gorgeous', taste_id: '18gor'}, {cell_id: 'gp-1_2', axis: '(-1, 2)', taste: 'hard modern', taste_id: '21hmo'}, {cell_id: 'gp-2_-2', axis: '(-2, -2)', taste: 'soft modern', taste_id: '04smo'}, {cell_id: 'gp-2_-1', axis: '(-2, -1)', taste: 'soft elegant-', taste_id: '08sel-'}, {cell_id: 'gp-2_0', axis: '(-2, 0)', taste: 'elegant gorgeous', taste_id: '14elg'}, {cell_id: 'gp-2_1', axis: '(-2, 1)', taste: 'gorgeous-', taste_id: '18gor-'}, {cell_id: 'gp-2_2', axis: '(-2, 2)', taste: 'formal', taste_id: '22for'}, {cell_id: 'gp-3_-1', axis: '(-3, -1)', taste: 'elegant-', taste_id: '09ele-'}, {cell_id: 'gp-3_0', axis: '(-3, 0)', taste: 'elegant', taste_id: '09ele'}, {cell_id: 'gp-3_1', axis: '(-3, 1)', taste: 'elegant+', taste_id: '09ele+'}];
}

/**
 * [Utility]グローブ座標の各セルを透明なdivとして生成
 */
function drawEmptyGlobe() {
	removeElement("colorglobe");
	
	var x_list = [3, 2, 1, 0, -1, -2, -3];
	var y_list = [-2, -1, 0, 1, 2];
	
	
	for (var i=0; i<x_list.length; i++) {
		for (var j=0; j<y_list.length; j++) {
			var position = getCellPositionOnGlobe(x_list[i], y_list[j]);
			if (position !== null) {
				var cell_id = "gp" +  x_list[i] + "_" + y_list[j];
				addDivTag("colorglobe", "globecell", cell_id, "");
				var ch = document.getElementById(cell_id);
				if (ch === null) { return; }					
				ch.style.left = position[0] + "px";
				ch.style.top = position[1] + "px";
			}
		}
	}
}



/****************************
 * 色相リスト描画関連
 ****************************/

/**
 * 色相リスト描画
 */
function drawHueCircle() {
	var hue_id_list = getHueIDList();
	
	for (var i=0; i<hue_id_list.length; i++) {
		var hue_id = hue_id_list[i];
		var hue_str = hue_id.replace(/_/, ".");
		var hue_str2 = hue_str.replace(/hue([0-9]+)(.[0-9])*.([A-Z])/,"$1$2$3");
		addDivTag('huecircle', 'hue',  hue_id, '');
		var ch = document.getElementById(hue_id);
		if (ch === null) { return; }
		var munsell_value = 7;
		var munsell_chroma = 8; 
                
                var color_info = getNearestValue(hue_id, munsell_value, munsell_chroma);
                ch.title = 	hue_str2;
		ch.style.background = color_info.hex;
                
		/* var hvc = getAdjustedHexAndMunsellVC2(hue_id, munsell_value, munsell_chroma)	; 
		ch.title = 	hue_str2;
		ch.style.background = hvc[0];*/
        

	}
}

/**
 * hue_idリストを返す
 * @returns {hue_id|Array}
 */
function getHueIDList() {
	return  ['hue2_5_R', 'hue5_R', 'hue7_5_R', 'hue10_R', 'hue2_5_YR', 'hue5_YR', 'hue7_5_YR', 'hue10_YR', 'hue2_5_Y', 'hue5_Y', 'hue7_5_Y', 'hue10_Y', 'hue2_5_GY', 'hue5_GY', 'hue7_5_GY', 'hue10_GY', 'hue2_5_G', 'hue5_G', 'hue7_5_G', 'hue10_G', 'hue2_5_BG', 'hue5_BG', 'hue7_5_BG', 'hue10_BG', 'hue2_5_B', 'hue5_B', 'hue7_5_B', 'hue10_B', 'hue2_5_PB', 'hue5_PB', 'hue7_5_PB', 'hue10_PB', 'hue2_5_P', 'hue5_P', 'hue7_5_P', 'hue10_P', 'hue2_5_RP', 'hue5_RP', 'hue7_5_RP', 'hue10_RP'];
}

/****************************
 * 色情報取得共通
 ****************************/

/**
 * マンセル値リストを取得
 * @param {String} hue_id
 * @returns {Array|String}
 */
function getMunsellJSON(hue_id) {
	switch (hue_id) {
		case 'hue2_5_R': return [{color:"#e5e5e5", v:9,c:0},{color:"#F8DEEB", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#DCC2CE", v:8,c:2},{color:"#F2BBC7", v:8,c:4},{color:"#aeaeae", v:7,c:0},{color:"#C3A7B1", v:7,c:2},{color:"#D5A0AB", v:7,c:4},{color:"#E699A6", v:7,c:6},{color:"#F791A0", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#A88C96", v:6,c:2},{color:"#B98690", v:6,c:4},{color:"#CA7F8B", v:6,c:6},{color:"#D87786", v:6,c:8},{color:"#E76E81", v:6,c:10},{color:"#F5647D", v:6,c:12},{color:"#7b7b7b", v:5,c:0},{color:"#8E737B", v:5,c:2},{color:"#9F6C76", v:5,c:4},{color:"#AE6571", v:5,c:6},{color:"#BD5C6D", v:5,c:8},{color:"#CA5269", v:5,c:10},{color:"#D84565", v:5,c:12},{color:"#E23762", v:5,c:14},{color:"#EF1A5F", v:5,c:16},{color:"#626262", v:4,c:0},{color:"#765A61", v:4,c:2},{color:"#85535D", v:4,c:4},{color:"#934C59", v:4,c:6},{color:"#A04255", v:4,c:8},{color:"#AC3752", v:4,c:10},{color:"#B7274F", v:4,c:12},{color:"#4a4a4a", v:3,c:0},{color:"#5E4249", v:3,c:2},{color:"#6D3B45", v:3,c:4},{color:"#783342", v:3,c:6},{color:"#85273F", v:3,c:8},{color:"#900F3D", v:3,c:10},{color:"#323232", v:2,c:0},{color:"#462E36", v:2,c:2},{color:"#512835", v:2,c:4},{color:"#5B1F34", v:2,c:6},{color:"#650D34", v:2,c:8},{color:"#1b1b1b", v:1,c:0},{color:"#321B25", v:1,c:2},{color:"#3B1326", v:1,c:4}];
		case 'hue5_R': return [{color:"#e5e5e5", v:9,c:0},{color:"#FADDE9", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#DDC2CC", v:8,c:2},{color:"#F3BAC2", v:8,c:4},{color:"#aeaeae", v:7,c:0},{color:"#C4A6AF", v:7,c:2},{color:"#D6A0A7", v:7,c:4},{color:"#E8999F", v:7,c:6},{color:"#F89197", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#A98C94", v:6,c:2},{color:"#BB868C", v:6,c:4},{color:"#CB7F85", v:6,c:6},{color:"#DA787E", v:6,c:8},{color:"#E86F76", v:6,c:10},{color:"#F6646F", v:6,c:12},{color:"#7b7b7b", v:5,c:0},{color:"#8E7379", v:5,c:2},{color:"#A06C72", v:5,c:4},{color:"#B0656B", v:5,c:6},{color:"#BE5D64", v:5,c:8},{color:"#CB535D", v:5,c:10},{color:"#D94756", v:5,c:12},{color:"#E33950", v:5,c:14},{color:"#F01F4A", v:5,c:16},{color:"#626262", v:4,c:0},{color:"#775A5F", v:4,c:2},{color:"#865358", v:4,c:4},{color:"#944C52", v:4,c:6},{color:"#A1434C", v:4,c:8},{color:"#AC3846", v:4,c:10},{color:"#B72A40", v:4,c:12},{color:"#4a4a4a", v:3,c:0},{color:"#5F4247", v:3,c:2},{color:"#6D3B41", v:3,c:4},{color:"#79343C", v:3,c:6},{color:"#852836", v:3,c:8},{color:"#901332", v:3,c:10},{color:"#323232", v:2,c:0},{color:"#462E34", v:2,c:2},{color:"#512831", v:2,c:4},{color:"#5C1F2F", v:2,c:6},{color:"#660C2C", v:2,c:8},{color:"#1b1b1b", v:1,c:0},{color:"#331B22", v:1,c:2},{color:"#3C1322", v:1,c:4}];
		case 'hue7_5_R': return [{color:"#e5e5e5", v:9,c:0},{color:"#FBDDE6", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#DEC2CA", v:8,c:2},{color:"#F5BABD", v:8,c:4},{color:"#aeaeae", v:7,c:0},{color:"#C5A6AD", v:7,c:2},{color:"#D7A0A2", v:7,c:4},{color:"#E89A98", v:7,c:6},{color:"#FA928C", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#AA8C91", v:6,c:2},{color:"#BC8688", v:6,c:4},{color:"#CC807E", v:6,c:6},{color:"#DA7874", v:6,c:8},{color:"#E96F69", v:6,c:10},{color:"#F6665F", v:6,c:12},{color:"#7b7b7b", v:5,c:0},{color:"#8F7377", v:5,c:2},{color:"#A16D6E", v:5,c:4},{color:"#B06664", v:5,c:6},{color:"#BE5E5A", v:5,c:8},{color:"#CB5551", v:5,c:10},{color:"#D84947", v:5,c:12},{color:"#E33D3D", v:5,c:14},{color:"#EE2933", v:5,c:16},{color:"#626262", v:4,c:0},{color:"#775A5D", v:4,c:2},{color:"#875355", v:4,c:4},{color:"#944C4C", v:4,c:6},{color:"#A14443", v:4,c:8},{color:"#AC3A3B", v:4,c:10},{color:"#B72D33", v:4,c:12},{color:"#C1162A", v:4,c:14},{color:"#4a4a4a", v:3,c:0},{color:"#5F4345", v:3,c:2},{color:"#6D3C3D", v:3,c:4},{color:"#793436", v:3,c:6},{color:"#842A2E", v:3,c:8},{color:"#8F1A26", v:3,c:10},{color:"#323232", v:2,c:0},{color:"#462E32", v:2,c:2},{color:"#52282D", v:2,c:4},{color:"#5C2029", v:2,c:6},{color:"#661024", v:2,c:8},{color:"#1b1b1b", v:1,c:0},{color:"#331B21", v:1,c:2},{color:"#3C131F", v:1,c:4}];
		case 'hue10_R': return [{color:"#e5e5e5", v:9,c:0},{color:"#FCDDE4", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#DFC2C7", v:8,c:2},{color:"#F6BBB7", v:8,c:4},{color:"#aeaeae", v:7,c:0},{color:"#C5A7AA", v:7,c:2},{color:"#D8A19C", v:7,c:4},{color:"#E99A8F", v:7,c:6},{color:"#F99380", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#AB8C8F", v:6,c:2},{color:"#BC8782", v:6,c:4},{color:"#CB8175", v:6,c:6},{color:"#DA7A68", v:6,c:8},{color:"#E7725A", v:6,c:10},{color:"#F46B4A", v:6,c:12},{color:"#FF6239", v:6,c:14},{color:"#7b7b7b", v:5,c:0},{color:"#8F7375", v:5,c:2},{color:"#A16D68", v:5,c:4},{color:"#B0675C", v:5,c:6},{color:"#BD604F", v:5,c:8},{color:"#C95841", v:5,c:10},{color:"#D44F31", v:5,c:12},{color:"#DD4720", v:5,c:14},{color:"#626262", v:4,c:0},{color:"#775A5B", v:4,c:2},{color:"#875450", v:4,c:4},{color:"#934E45", v:4,c:6},{color:"#9F4639", v:4,c:8},{color:"#AA3E2D", v:4,c:10},{color:"#B3341E", v:4,c:12},{color:"#4a4a4a", v:3,c:0},{color:"#5F4343", v:3,c:2},{color:"#6C3D3A", v:3,c:4},{color:"#783630", v:3,c:6},{color:"#832D26", v:3,c:8},{color:"#8D201B", v:3,c:10},{color:"#323232", v:2,c:0},{color:"#462F30", v:2,c:2},{color:"#522929", v:2,c:4},{color:"#5C2122", v:2,c:6},{color:"#66141B", v:2,c:8},{color:"#1b1b1b", v:1,c:0},{color:"#331B1F", v:1,c:2},{color:"#3D131B", v:1,c:4}];
		case 'hue2_5_YR': return [{color:"#e5e5e5", v:9,c:0},{color:"#FDDDE0", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#DFC2C4", v:8,c:2},{color:"#F5BCB1", v:8,c:4},{color:"#aeaeae", v:7,c:0},{color:"#C5A7A7", v:7,c:2},{color:"#D7A297", v:7,c:4},{color:"#E89C86", v:7,c:6},{color:"#F69676", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#AB8D8B", v:6,c:2},{color:"#BB887D", v:6,c:4},{color:"#CA826D", v:6,c:6},{color:"#D77D5E", v:6,c:8},{color:"#E3764C", v:6,c:10},{color:"#ED7139", v:6,c:12},{color:"#F56B1F", v:6,c:14},{color:"#7b7b7b", v:5,c:0},{color:"#907472", v:5,c:2},{color:"#9F6E64", v:5,c:4},{color:"#AD6955", v:5,c:6},{color:"#BA6344", v:5,c:8},{color:"#C45D33", v:5,c:10},{color:"#CC581E", v:5,c:12},{color:"#626262", v:4,c:0},{color:"#775B58", v:4,c:2},{color:"#85554B", v:4,c:4},{color:"#91503D", v:4,c:6},{color:"#9B4A2F", v:4,c:8},{color:"#A4451C", v:4,c:10},{color:"#4a4a4a", v:3,c:0},{color:"#5E4441", v:3,c:2},{color:"#6A3E35", v:3,c:4},{color:"#753928", v:3,c:6},{color:"#7E3219", v:3,c:8},{color:"#323232", v:2,c:0},{color:"#452F2E", v:2,c:2},{color:"#512A25", v:2,c:4},{color:"#5A231B", v:2,c:6},{color:"#641909", v:2,c:8},{color:"#1b1b1b", v:1,c:0},{color:"#321C1C", v:1,c:2},{color:"#3D1414", v:1,c:4},{color:"#45040D", v:1,c:6}];
		case 'hue5_YR': return [{color:"#e5e5e5", v:9,c:0},{color:"#FDDEDB", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#E0C2BF", v:8,c:2},{color:"#F2BEAB", v:8,c:4},{color:"#aeaeae", v:7,c:0},{color:"#C5A7A4", v:7,c:2},{color:"#D5A391", v:7,c:4},{color:"#E49F7E", v:7,c:6},{color:"#F09A6C", v:7,c:8},{color:"#FB9657", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#AA8D89", v:6,c:2},{color:"#B98978", v:6,c:4},{color:"#C78565", v:6,c:6},{color:"#D28052", v:6,c:8},{color:"#DC7C3E", v:6,c:10},{color:"#E47825", v:6,c:12},{color:"#7b7b7b", v:5,c:0},{color:"#8F746F", v:5,c:2},{color:"#9D705E", v:5,c:4},{color:"#AA6B4C", v:5,c:6},{color:"#B5673A", v:5,c:8},{color:"#BD6326", v:5,c:10},{color:"#626262", v:4,c:0},{color:"#765B55", v:4,c:2},{color:"#835745", v:4,c:4},{color:"#8D5336", v:4,c:6},{color:"#964F25", v:4,c:8},{color:"#4a4a4a", v:3,c:0},{color:"#5C443F", v:3,c:2},{color:"#684031", v:3,c:4},{color:"#713C22", v:3,c:6},{color:"#783809", v:3,c:8},{color:"#323232", v:2,c:0},{color:"#44302C", v:2,c:2},{color:"#4F2C1F", v:2,c:4},{color:"#57270E", v:2,c:6},{color:"#1b1b1b", v:1,c:0},{color:"#311D18", v:1,c:2},{color:"#3C1608", v:1,c:4}];
		case 'hue7_5_YR': return [{color:"#e5e5e5", v:9,c:0},{color:"#FDDED6", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#DFC3BC", v:8,c:2},{color:"#EFC0A6", v:8,c:4},{color:"#FDBC90", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#C4A8A1", v:7,c:2},{color:"#D3A58C", v:7,c:4},{color:"#DFA177", v:7,c:6},{color:"#EA9E62", v:7,c:8},{color:"#F39B4B", v:7,c:10},{color:"#FB982D", v:7,c:12},{color:"#959595", v:6,c:0},{color:"#A98E86", v:6,c:2},{color:"#B78B73", v:6,c:4},{color:"#C2875F", v:6,c:6},{color:"#CC8449", v:6,c:8},{color:"#D48131", v:6,c:10},{color:"#7b7b7b", v:5,c:0},{color:"#8E756D", v:5,c:2},{color:"#9B715A", v:5,c:4},{color:"#A66E46", v:5,c:6},{color:"#AF6B31", v:5,c:8},{color:"#B56815", v:5,c:10},{color:"#626262", v:4,c:0},{color:"#745C53", v:4,c:2},{color:"#815941", v:4,c:4},{color:"#895630", v:4,c:6},{color:"#90531B", v:4,c:8},{color:"#4a4a4a", v:3,c:0},{color:"#5B453D", v:3,c:2},{color:"#65422E", v:3,c:4},{color:"#6D3F1C", v:3,c:6},{color:"#323232", v:2,c:0},{color:"#43312A", v:2,c:2},{color:"#4C2E1B", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#301E16", v:1,c:2}];
		case 'hue10_YR': return  [{color:"#e5e5e5", v:9,c:0},{color:"#FBE0D2", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#DDC4B8", v:8,c:2},{color:"#EAC2A0", v:8,c:4},{color:"#F6BF89", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#C2A99D", v:7,c:2},{color:"#CEA786", v:7,c:4},{color:"#D9A56F", v:7,c:6},{color:"#E2A258", v:7,c:8},{color:"#E9A03F", v:7,c:10},{color:"#EF9E15", v:7,c:12},{color:"#959595", v:6,c:0},{color:"#A68F83", v:6,c:2},{color:"#B28D6E", v:6,c:4},{color:"#BD8A57", v:6,c:6},{color:"#C5883F", v:6,c:8},{color:"#CB8623", v:6,c:10},{color:"#7b7b7b", v:5,c:0},{color:"#8C766A", v:5,c:2},{color:"#977355", v:5,c:4},{color:"#A1713F", v:5,c:6},{color:"#A76F27", v:5,c:8},{color:"#626262", v:4,c:0},{color:"#725D51", v:4,c:2},{color:"#7D5B3D", v:4,c:4},{color:"#84592A", v:4,c:6},{color:"#89570E", v:4,c:8},{color:"#4a4a4a", v:3,c:0},{color:"#58463B", v:3,c:2},{color:"#61442A", v:3,c:4},{color:"#684215", v:3,c:6},{color:"#323232", v:2,c:0},{color:"#413228", v:2,c:2},{color:"#492F17", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#2F1F13", v:1,c:2}];
		case 'hue2_5_Y': return [{color:"#e5e5e5", v:9,c:0},{color:"#F8E1D0", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#DAC5B5", v:8,c:2},{color:"#E5C49C", v:8,c:4},{color:"#EEC383", v:8,c:6},{color:"#F6C169", v:8,c:8},{color:"#FDC04E", v:8,c:10},{color:"#aeaeae", v:7,c:0},{color:"#BEAB9B", v:7,c:2},{color:"#C9A983", v:7,c:4},{color:"#D2A86A", v:7,c:6},{color:"#D9A751", v:7,c:8},{color:"#DFA532", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#A39181", v:6,c:2},{color:"#AD8F6A", v:6,c:4},{color:"#B68E51", v:6,c:6},{color:"#BD8C37", v:6,c:8},{color:"#C18B0E", v:6,c:10},{color:"#7b7b7b", v:5,c:0},{color:"#897769", v:5,c:2},{color:"#927652", v:5,c:4},{color:"#9A7439", v:5,c:6},{color:"#9F731E", v:5,c:8},{color:"#626262", v:4,c:0},{color:"#6F5F4F", v:4,c:2},{color:"#785D3A", v:4,c:4},{color:"#7E5C25", v:4,c:6},{color:"#4a4a4a", v:3,c:0},{color:"#56483A", v:3,c:2},{color:"#5D4628", v:3,c:4},{color:"#62450D", v:3,c:6},{color:"#323232", v:2,c:0},{color:"#3F3327", v:2,c:2},{color:"#463112", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#2C2012", v:1,c:2}];
		case 'hue5_Y': return [{color:"#e5e5e5", v:9,c:0},{color:"#F4E2CE", v:9,c:2},{color:"#FBE3B1", v:9,c:4},{color:"#c9c9c9", v:8,c:0},{color:"#D7C7B3", v:8,c:2},{color:"#DEC799", v:8,c:4},{color:"#E5C77E", v:8,c:6},{color:"#EBC662", v:8,c:8},{color:"#EFC643", v:8,c:10},{color:"#aeaeae", v:7,c:0},{color:"#BBAC9A", v:7,c:2},{color:"#C3AC7F", v:7,c:4},{color:"#C9AC65", v:7,c:6},{color:"#CFAB4B", v:7,c:8},{color:"#D3AA26", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#A09280", v:6,c:2},{color:"#A79267", v:6,c:4},{color:"#AE914D", v:6,c:6},{color:"#B39130", v:6,c:8},{color:"#7b7b7b", v:5,c:0},{color:"#857867", v:5,c:2},{color:"#8D784F", v:5,c:4},{color:"#937735", v:5,c:6},{color:"#977715", v:5,c:8},{color:"#626262", v:4,c:0},{color:"#6C604F", v:4,c:2},{color:"#735F38", v:4,c:4},{color:"#775F20", v:4,c:6},{color:"#4a4a4a", v:3,c:0},{color:"#53493A", v:3,c:2},{color:"#594826", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#3D3427", v:2,c:2},{color:"#42330F", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#2A2112", v:1,c:2}];
		case 'hue7_5_Y': return [{color:"#e5e5e5", v:9,c:0},{color:"#F1E3CD", v:9,c:2},{color:"#F7E5B0", v:9,c:4},{color:"#FBE594", v:9,c:6},{color:"#FFE676", v:9,c:8},{color:"#c9c9c9", v:8,c:0},{color:"#D5C8B2", v:8,c:2},{color:"#DAC998", v:8,c:4},{color:"#DEC97C", v:8,c:6},{color:"#E2CA5F", v:8,c:8},{color:"#E5CA3F", v:8,c:10},{color:"#aeaeae", v:7,c:0},{color:"#B9AD99", v:7,c:2},{color:"#BEAE7F", v:7,c:4},{color:"#C2AE64", v:7,c:6},{color:"#C5AF48", v:7,c:8},{color:"#C8AF1F", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#9D937F", v:6,c:2},{color:"#A29366", v:6,c:4},{color:"#A7944B", v:6,c:6},{color:"#AA942C", v:6,c:8},{color:"#7b7b7b", v:5,c:0},{color:"#837967", v:5,c:2},{color:"#887A4E", v:5,c:4},{color:"#8C7A33", v:5,c:6},{color:"#8E7A0C", v:5,c:8},{color:"#626262", v:4,c:0},{color:"#69614F", v:4,c:2},{color:"#6E6137", v:4,c:4},{color:"#71611E", v:4,c:6},{color:"#4a4a4a", v:3,c:0},{color:"#51493A", v:3,c:2},{color:"#544A25", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#3A3428", v:2,c:2},{color:"#3E340E", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#272213", v:1,c:2}];
		case 'hue10_Y': return [{color:"#e5e5e5", v:9,c:0},{color:"#EFE4CC", v:9,c:2},{color:"#F2E6B0", v:9,c:4},{color:"#F5E893", v:9,c:6},{color:"#F7E975", v:9,c:8},{color:"#F8EA57", v:9,c:10},{color:"#FAEA2B", v:9,c:12},{color:"#c9c9c9", v:8,c:0},{color:"#D2C9B2", v:8,c:2},{color:"#D5CA98", v:8,c:4},{color:"#D7CB7C", v:8,c:6},{color:"#D9CD60", v:8,c:8},{color:"#DBCD3E", v:8,c:10},{color:"#aeaeae", v:7,c:0},{color:"#B6AE99", v:7,c:2},{color:"#B9AF7F", v:7,c:4},{color:"#BBB065", v:7,c:6},{color:"#BDB147", v:7,c:8},{color:"#BEB21B", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#9B9480", v:6,c:2},{color:"#9D9567", v:6,c:4},{color:"#9F964B", v:6,c:6},{color:"#A1972B", v:6,c:8},{color:"#7b7b7b", v:5,c:0},{color:"#807A68", v:5,c:2},{color:"#837C4F", v:5,c:4},{color:"#847D34", v:5,c:6},{color:"#867D0B", v:5,c:8},{color:"#626262", v:4,c:0},{color:"#656250", v:4,c:2},{color:"#696338", v:4,c:4},{color:"#6A631E", v:4,c:6},{color:"#4a4a4a", v:3,c:0},{color:"#4E4A3B", v:3,c:2},{color:"#504B26", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#383529", v:2,c:2},{color:"#3A3610", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#252315", v:1,c:2}];
		case 'hue2_5_GY': return [{color:"#e5e5e5", v:9,c:0},{color:"#ECE5CD", v:9,c:2},{color:"#EBE8B1", v:9,c:4},{color:"#EBEA96", v:9,c:6},{color:"#EAED78", v:9,c:8},{color:"#E9EE5A", v:9,c:10},{color:"#E8F02E", v:9,c:12},{color:"#c9c9c9", v:8,c:0},{color:"#CFCAB3", v:8,c:2},{color:"#CECC9A", v:8,c:4},{color:"#CDCE80", v:8,c:6},{color:"#CDD065", v:8,c:8},{color:"#CCD243", v:8,c:10},{color:"#aeaeae", v:7,c:0},{color:"#B2AF9A", v:7,c:2},{color:"#B2B181", v:7,c:4},{color:"#B1B369", v:7,c:6},{color:"#B0B54C", v:7,c:8},{color:"#AFB725", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#979581", v:6,c:2},{color:"#969769", v:6,c:4},{color:"#969950", v:6,c:6},{color:"#949B31", v:6,c:8},{color:"#7b7b7b", v:5,c:0},{color:"#7C7B69", v:5,c:2},{color:"#7C7D52", v:5,c:4},{color:"#7B7F39", v:5,c:6},{color:"#7A8116", v:5,c:8},{color:"#626262", v:4,c:0},{color:"#636352", v:4,c:2},{color:"#62653B", v:4,c:4},{color:"#616623", v:4,c:6},{color:"#4a4a4a", v:3,c:0},{color:"#4B4B3C", v:3,c:2},{color:"#4A4D28", v:3,c:4},{color:"#494E0C", v:3,c:6},{color:"#323232", v:2,c:0},{color:"#35362A", v:2,c:2},{color:"#343716", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#222318", v:1,c:2}];
		case 'hue5_GY': return [{color:"#e5e5e5", v:9,c:0},{color:"#E8E6CF", v:9,c:2},{color:"#E5EAB4", v:9,c:4},{color:"#E1ED9A", v:9,c:6},{color:"#DDF07E", v:9,c:8},{color:"#D9F262", v:9,c:10},{color:"#D4F53D", v:9,c:12},{color:"#c9c9c9", v:8,c:0},{color:"#CBCAB5", v:8,c:2},{color:"#C8CE9D", v:8,c:4},{color:"#C4D185", v:8,c:6},{color:"#C0D46C", v:8,c:8},{color:"#BBD64F", v:8,c:10},{color:"#B7D824", v:8,c:12},{color:"#aeaeae", v:7,c:0},{color:"#AFB09C", v:7,c:2},{color:"#ABB385", v:7,c:4},{color:"#A7B66F", v:7,c:6},{color:"#A3B856", v:7,c:8},{color:"#9FBB35", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#939683", v:6,c:2},{color:"#90996D", v:6,c:4},{color:"#8C9B56", v:6,c:6},{color:"#879E3C", v:6,c:8},{color:"#83A015", v:6,c:10},{color:"#7b7b7b", v:5,c:0},{color:"#797C6B", v:5,c:2},{color:"#757F57", v:5,c:4},{color:"#718240", v:5,c:6},{color:"#6C8425", v:5,c:8},{color:"#626262", v:4,c:0},{color:"#606353", v:4,c:2},{color:"#5C663F", v:4,c:4},{color:"#57682A", v:4,c:6},{color:"#4a4a4a", v:3,c:0},{color:"#484C3E", v:3,c:2},{color:"#444E2C", v:3,c:4},{color:"#3F5017", v:3,c:6},{color:"#323232", v:2,c:0},{color:"#33362C", v:2,c:2},{color:"#2E391C", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#20241A", v:1,c:2}];
		case 'hue7_5_GY': return [{color:"#e5e5e5", v:9,c:0},{color:"#DFE8D4", v:9,c:2},{color:"#D6EDBE", v:9,c:4},{color:"#CCF2A7", v:9,c:6},{color:"#C3F590", v:9,c:8},{color:"#B9F978", v:9,c:10},{color:"#AEFC5E", v:9,c:12},{color:"#A4FF3F", v:9,c:14},{color:"#c9c9c9", v:8,c:0},{color:"#C4CCBA", v:8,c:2},{color:"#BAD1A6", v:8,c:4},{color:"#B1D592", v:8,c:6},{color:"#A9D87D", v:8,c:8},{color:"#9FDC66", v:8,c:10},{color:"#94DF4B", v:8,c:12},{color:"#89E225", v:8,c:14},{color:"#aeaeae", v:7,c:0},{color:"#A8B1A1", v:7,c:2},{color:"#A0B58E", v:7,c:4},{color:"#97B97B", v:7,c:6},{color:"#8EBD67", v:7,c:8},{color:"#83C050", v:7,c:10},{color:"#78C334", v:7,c:12},{color:"#959595", v:6,c:0},{color:"#8E9787", v:6,c:2},{color:"#859B75", v:6,c:4},{color:"#7C9E63", v:6,c:6},{color:"#72A24E", v:6,c:8},{color:"#67A537", v:6,c:10},{color:"#5CA712", v:6,c:12},{color:"#7b7b7b", v:5,c:0},{color:"#757D6F", v:5,c:2},{color:"#6C815E", v:5,c:4},{color:"#62844C", v:5,c:6},{color:"#588738", v:5,c:8},{color:"#4D8A1D", v:5,c:10},{color:"#626262", v:4,c:0},{color:"#5B6457", v:4,c:2},{color:"#526847", v:4,c:4},{color:"#486B35", v:4,c:6},{color:"#3D6E20", v:4,c:8},{color:"#4a4a4a", v:3,c:0},{color:"#444C42", v:3,c:2},{color:"#3C5033", v:3,c:4},{color:"#325224", v:3,c:6},{color:"#25550A", v:3,c:8},{color:"#323232", v:2,c:0},{color:"#30372F", v:2,c:2},{color:"#283A22", v:2,c:4},{color:"#1C3C13", v:2,c:6},{color:"#1b1b1b", v:1,c:0},{color:"#1D241D", v:1,c:2},{color:"#0F270D", v:1,c:4}];
		case 'hue10_GY': return [{color:"#e5e5e5", v:9,c:0},{color:"#D9E9D9", v:9,c:2},{color:"#CBEFC8", v:9,c:4},{color:"#BAF5B4", v:9,c:6},{color:"#ABF9A4", v:9,c:8},{color:"#99FE91", v:9,c:10},{color:"#c9c9c9", v:8,c:0},{color:"#BECDBF", v:8,c:2},{color:"#B1D2AE", v:8,c:4},{color:"#A2D79E", v:8,c:6},{color:"#94DB8F", v:8,c:8},{color:"#82DF7E", v:8,c:10},{color:"#6EE36C", v:8,c:12},{color:"#56E75A", v:8,c:14},{color:"#2EEA44", v:8,c:16},{color:"#aeaeae", v:7,c:0},{color:"#A4B2A5", v:7,c:2},{color:"#97B795", v:7,c:4},{color:"#8ABB87", v:7,c:6},{color:"#7BBF77", v:7,c:8},{color:"#69C367", v:7,c:10},{color:"#53C756", v:7,c:12},{color:"#33CA43", v:7,c:14},{color:"#959595", v:6,c:0},{color:"#89988B", v:6,c:2},{color:"#7D9C7D", v:6,c:4},{color:"#6FA06E", v:6,c:6},{color:"#5FA45F", v:6,c:8},{color:"#4CA84F", v:6,c:10},{color:"#30AB3E", v:6,c:12},{color:"#7b7b7b", v:5,c:0},{color:"#717E72", v:5,c:2},{color:"#648265", v:5,c:4},{color:"#568657", v:5,c:6},{color:"#458A48", v:5,c:8},{color:"#2C8D39", v:5,c:10},{color:"#626262", v:4,c:0},{color:"#59655A", v:4,c:2},{color:"#4C694D", v:4,c:4},{color:"#3C6D3F", v:4,c:6},{color:"#267032", v:4,c:8},{color:"#4a4a4a", v:3,c:0},{color:"#424D44", v:3,c:2},{color:"#355139", v:3,c:4},{color:"#25542E", v:3,c:6},{color:"#323232", v:2,c:0},{color:"#2E3731", v:2,c:2},{color:"#223A28", v:2,c:4},{color:"#0B3D1E", v:2,c:6},{color:"#1b1b1b", v:1,c:0},{color:"#1B241F", v:1,c:2}];
		case 'hue2_5_G': return [{color:"#e5e5e5", v:9,c:0},{color:"#D4EADF", v:9,c:2},{color:"#C1F0D3", v:9,c:4},{color:"#A9F7C5", v:9,c:6},{color:"#92FCB9", v:9,c:8},{color:"#c9c9c9", v:8,c:0},{color:"#B9CEC4", v:8,c:2},{color:"#A7D3B9", v:8,c:4},{color:"#92D9AD", v:8,c:6},{color:"#7DDEA3", v:8,c:8},{color:"#61E298", v:8,c:10},{color:"#33E68D", v:8,c:12},{color:"#aeaeae", v:7,c:0},{color:"#9FB3A9", v:7,c:2},{color:"#8EB89F", v:7,c:4},{color:"#7BBD95", v:7,c:6},{color:"#64C18B", v:7,c:8},{color:"#43C681", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#86988F", v:6,c:2},{color:"#749D85", v:6,c:4},{color:"#60A27C", v:6,c:6},{color:"#46A673", v:6,c:8},{color:"#11AA6A", v:6,c:10},{color:"#7b7b7b", v:5,c:0},{color:"#6D7E76", v:5,c:2},{color:"#5C836D", v:5,c:4},{color:"#478764", v:5,c:6},{color:"#248B5C", v:5,c:8},{color:"#626262", v:4,c:0},{color:"#55655E", v:4,c:2},{color:"#436A55", v:4,c:4},{color:"#286E4D", v:4,c:6},{color:"#4a4a4a", v:3,c:0},{color:"#404D47", v:3,c:2},{color:"#2E513F", v:3,c:4},{color:"#0B5539", v:3,c:6},{color:"#323232", v:2,c:0},{color:"#2D3732", v:2,c:2},{color:"#1C3B2D", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#1A2520", v:1,c:2}];
		case 'hue5_G': return [{color:"#e5e5e5", v:9,c:0},{color:"#D1EAE3", v:9,c:2},{color:"#BAF1DB", v:9,c:4},{color:"#9DF8D2", v:9,c:6},{color:"#7DFDCB", v:9,c:8},{color:"#c9c9c9", v:8,c:0},{color:"#B7CEC8", v:8,c:2},{color:"#A2D4C0", v:8,c:4},{color:"#88DAB9", v:8,c:6},{color:"#6BDFB2", v:8,c:8},{color:"#40E3AD", v:8,c:10},{color:"#aeaeae", v:7,c:0},{color:"#9DB3AD", v:7,c:2},{color:"#88B8A6", v:7,c:4},{color:"#71BDA0", v:7,c:6},{color:"#54C29A", v:7,c:8},{color:"#0EC794", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#839892", v:6,c:2},{color:"#6E9E8B", v:6,c:4},{color:"#56A385", v:6,c:6},{color:"#32A780", v:6,c:8},{color:"#7b7b7b", v:5,c:0},{color:"#6B7E79", v:5,c:2},{color:"#578373", v:5,c:4},{color:"#3D886D", v:5,c:6},{color:"#626262", v:4,c:0},{color:"#546560", v:4,c:2},{color:"#3E6A5A", v:4,c:4},{color:"#1B6E55", v:4,c:6},{color:"#4a4a4a", v:3,c:0},{color:"#3E4D49", v:3,c:2},{color:"#295243", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#2B3734", v:2,c:2},{color:"#183B30", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#192521", v:1,c:2}];
		case 'hue7_5_G': return [{color:"#e5e5e5", v:9,c:0},{color:"#CFEAE7", v:9,c:2},{color:"#B6F1E0", v:9,c:4},{color:"#96F8DA", v:9,c:6},{color:"#73FDD5", v:9,c:8},{color:"#c9c9c9", v:8,c:0},{color:"#B5CECB", v:8,c:2},{color:"#9ED4C5", v:8,c:4},{color:"#83DAC0", v:8,c:6},{color:"#63DFBC", v:8,c:8},{color:"#2AE3B8", v:8,c:10},{color:"#aeaeae", v:7,c:0},{color:"#9CB3AF", v:7,c:2},{color:"#85B9AA", v:7,c:4},{color:"#6CBDA6", v:7,c:6},{color:"#4AC2A2", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#829895", v:6,c:2},{color:"#6A9E90", v:6,c:4},{color:"#50A38C", v:6,c:6},{color:"#22A789", v:6,c:8},{color:"#7b7b7b", v:5,c:0},{color:"#6A7E7B", v:5,c:2},{color:"#548377", v:5,c:4},{color:"#368873", v:5,c:6},{color:"#626262", v:4,c:0},{color:"#536562", v:4,c:2},{color:"#3B6A5E", v:4,c:4},{color:"#4a4a4a", v:3,c:0},{color:"#3D4D4A", v:3,c:2},{color:"#255247", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#2B3735", v:2,c:2},{color:"#143B32", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#182522", v:1,c:2}];
		case 'hue10_G': return [{color:"#e5e5e5", v:9,c:0},{color:"#CEEAEA", v:9,c:2},{color:"#B3F1E6", v:9,c:4},{color:"#92F8E2", v:9,c:6},{color:"#69FDDF", v:9,c:8},{color:"#c9c9c9", v:8,c:0},{color:"#B4CECD", v:8,c:2},{color:"#9CD4CA", v:8,c:4},{color:"#7EDAC7", v:8,c:6},{color:"#5BDFC5", v:8,c:8},{color:"#aeaeae", v:7,c:0},{color:"#9BB3B2", v:7,c:2},{color:"#83B8AF", v:7,c:4},{color:"#67BEAC", v:7,c:6},{color:"#3FC2AA", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#819897", v:6,c:2},{color:"#689E94", v:6,c:4},{color:"#4BA392", v:6,c:6},{color:"#7b7b7b", v:5,c:0},{color:"#697E7D", v:5,c:2},{color:"#51837B", v:5,c:4},{color:"#318879", v:5,c:6},{color:"#626262", v:4,c:0},{color:"#516563", v:4,c:2},{color:"#386A62", v:4,c:4},{color:"#4a4a4a", v:3,c:0},{color:"#3C4D4C", v:3,c:2},{color:"#20524A", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#2A3736", v:2,c:2},{color:"#0E3B35", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#172523", v:1,c:2}];
		case 'hue2_5_BG': return [{color:"#e5e5e5", v:9,c:0},{color:"#CEEAEC", v:9,c:2},{color:"#B1F1EB", v:9,c:4},{color:"#8EF8E9", v:9,c:6},{color:"#61FDE8", v:9,c:8},{color:"#c9c9c9", v:8,c:0},{color:"#B4CECF", v:8,c:2},{color:"#9AD4CE", v:8,c:4},{color:"#7CDACD", v:8,c:6},{color:"#53DFCD", v:8,c:8},{color:"#aeaeae", v:7,c:0},{color:"#9AB3B4", v:7,c:2},{color:"#81B8B3", v:7,c:4},{color:"#64BDB3", v:7,c:6},{color:"#34C2B2", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#809899", v:6,c:2},{color:"#659E99", v:6,c:4},{color:"#46A398", v:6,c:6},{color:"#7b7b7b", v:5,c:0},{color:"#687E7F", v:5,c:2},{color:"#4F837F", v:5,c:4},{color:"#2B887F", v:5,c:6},{color:"#626262", v:4,c:0},{color:"#506566", v:4,c:2},{color:"#346A66", v:4,c:4},{color:"#4a4a4a", v:3,c:0},{color:"#3B4D4E", v:3,c:2},{color:"#1B524E", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#293738", v:2,c:2},{color:"#043B39", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#152525", v:1,c:2}];
		case 'hue5_BG': return [{color:"#e5e5e5", v:9,c:0},{color:"#CEEAEF", v:9,c:2},{color:"#B0F1F0", v:9,c:4},{color:"#8AF7F1", v:9,c:6},{color:"#56FDF3", v:9,c:8},{color:"#c9c9c9", v:8,c:0},{color:"#B3CED2", v:8,c:2},{color:"#98D4D4", v:8,c:4},{color:"#78D9D5", v:8,c:6},{color:"#48DED8", v:8,c:8},{color:"#aeaeae", v:7,c:0},{color:"#99B2B7", v:7,c:2},{color:"#7FB8B9", v:7,c:4},{color:"#61BDBB", v:7,c:6},{color:"#24C2BD", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#80989C", v:6,c:2},{color:"#649E9E", v:6,c:4},{color:"#3FA2A1", v:6,c:6},{color:"#7b7b7b", v:5,c:0},{color:"#677E82", v:5,c:2},{color:"#4D8384", v:5,c:4},{color:"#238787", v:5,c:6},{color:"#626262", v:4,c:0},{color:"#506568", v:4,c:2},{color:"#326A6B", v:4,c:4},{color:"#4a4a4a", v:3,c:0},{color:"#3A4D50", v:3,c:2},{color:"#165253", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#28373A", v:2,c:2},{color:"#1b1b1b", v:1,c:0},{color:"#142527", v:1,c:2}];
		case 'hue7_5_BG': return [{color:"#e5e5e5", v:9,c:0},{color:"#CEE9F3", v:9,c:2},{color:"#AFF0F7", v:9,c:4},{color:"#87F6FB", v:9,c:6},{color:"#c9c9c9", v:8,c:0},{color:"#B4CDD6", v:8,c:2},{color:"#98D3D9", v:8,c:4},{color:"#74D9DE", v:8,c:6},{color:"#40DDE3", v:8,c:8},{color:"#aeaeae", v:7,c:0},{color:"#99B2BA", v:7,c:2},{color:"#7EB8BE", v:7,c:4},{color:"#5FBCC2", v:7,c:6},{color:"#18C1C7", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#80989F", v:6,c:2},{color:"#639DA3", v:6,c:4},{color:"#3CA2A8", v:6,c:6},{color:"#7b7b7b", v:5,c:0},{color:"#677E84", v:5,c:2},{color:"#4C8389", v:5,c:4},{color:"#1A878E", v:5,c:6},{color:"#626262", v:4,c:0},{color:"#4F656A", v:4,c:2},{color:"#316970", v:4,c:4},{color:"#4a4a4a", v:3,c:0},{color:"#394D52", v:3,c:2},{color:"#115158", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#27373B", v:2,c:2},{color:"#1b1b1b", v:1,c:0},{color:"#132528", v:1,c:2}];
		case 'hue10_BG': return [{color:"#e5e5e5", v:9,c:0},{color:"#D0E9F5", v:9,c:2},{color:"#AFEFFC", v:9,c:4},{color:"#c9c9c9", v:8,c:0},{color:"#B5CCD8", v:8,c:2},{color:"#98D2DF", v:8,c:4},{color:"#74D8E6", v:8,c:6},{color:"#3DDCED", v:8,c:8},{color:"#aeaeae", v:7,c:0},{color:"#9AB1BC", v:7,c:2},{color:"#7EB7C3", v:7,c:4},{color:"#5FBBC9", v:7,c:6},{color:"#0BC0D1", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#8097A1", v:6,c:2},{color:"#649CA8", v:6,c:4},{color:"#3CA1B0", v:6,c:6},{color:"#7b7b7b", v:5,c:0},{color:"#677E86", v:5,c:2},{color:"#4D828E", v:5,c:4},{color:"#178695", v:5,c:6},{color:"#626262", v:4,c:0},{color:"#4F656C", v:4,c:2},{color:"#316974", v:4,c:4},{color:"#4a4a4a", v:3,c:0},{color:"#384D54", v:3,c:2},{color:"#10515C", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#27373D", v:2,c:2},{color:"#1b1b1b", v:1,c:0},{color:"#12252A", v:1,c:2}];
		case 'hue2_5_B': return [{color:"#e5e5e5", v:9,c:0},{color:"#D2E7F7", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#B7CCDA", v:8,c:2},{color:"#99D1E3", v:8,c:4},{color:"#77D6ED", v:8,c:6},{color:"#40DBF7", v:8,c:8},{color:"#aeaeae", v:7,c:0},{color:"#9CB1BE", v:7,c:2},{color:"#81B6C7", v:7,c:4},{color:"#61BAD0", v:7,c:6},{color:"#20BEDA", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#8297A3", v:6,c:2},{color:"#679BAC", v:6,c:4},{color:"#409FB6", v:6,c:6},{color:"#7b7b7b", v:5,c:0},{color:"#697D88", v:5,c:2},{color:"#4F8191", v:5,c:4},{color:"#1F859B", v:5,c:6},{color:"#626262", v:4,c:0},{color:"#50646E", v:4,c:2},{color:"#336878", v:4,c:4},{color:"#4a4a4a", v:3,c:0},{color:"#394D56", v:3,c:2},{color:"#115060", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#27373F", v:2,c:2},{color:"#1b1b1b", v:1,c:0},{color:"#12242C", v:1,c:2}];
		case 'hue5_B': return [{color:"#e5e5e5", v:9,c:0},{color:"#D6E6F9", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#BBCBDB", v:8,c:2},{color:"#9FD0E8", v:8,c:4},{color:"#7FD4F5", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#9FB0C0", v:7,c:2},{color:"#86B4CB", v:7,c:4},{color:"#67B8D7", v:7,c:6},{color:"#38BBE3", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#8496A4", v:6,c:2},{color:"#6C9AAF", v:6,c:4},{color:"#4B9DBC", v:6,c:6},{color:"#7b7b7b", v:5,c:0},{color:"#6B7C8A", v:5,c:2},{color:"#528095", v:5,c:4},{color:"#2D83A1", v:5,c:6},{color:"#626262", v:4,c:0},{color:"#516470", v:4,c:2},{color:"#37677B", v:4,c:4},{color:"#4a4a4a", v:3,c:0},{color:"#394C58", v:3,c:2},{color:"#184F63", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#273740", v:2,c:2},{color:"#1b1b1b", v:1,c:0},{color:"#12242D", v:1,c:2}];
		case 'hue7_5_B': return [{color:"#e5e5e5", v:9,c:0},{color:"#D9E5F9", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#BECADC", v:8,c:2},{color:"#A5CEEA", v:8,c:4},{color:"#88D2F9", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#A1AFC0", v:7,c:2},{color:"#8BB3CD", v:7,c:4},{color:"#72B6DB", v:7,c:6},{color:"#4CB9E9", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#8795A5", v:6,c:2},{color:"#7398B2", v:6,c:4},{color:"#579BBF", v:6,c:6},{color:"#2A9ECD", v:6,c:8},{color:"#7b7b7b", v:5,c:0},{color:"#6D7C8B", v:5,c:2},{color:"#587E97", v:5,c:4},{color:"#3C81A4", v:5,c:6},{color:"#626262", v:4,c:0},{color:"#536371", v:4,c:2},{color:"#3E657E", v:4,c:4},{color:"#19678A", v:4,c:6},{color:"#4a4a4a", v:3,c:0},{color:"#3B4C59", v:3,c:2},{color:"#214E66", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#283641", v:2,c:2},{color:"#09384D", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#14242E", v:1,c:2}];
		case 'hue10_B': return [{color:"#e5e5e5", v:9,c:0},{color:"#DCE4FA", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#C0C9DD", v:8,c:2},{color:"#ADCCED", v:8,c:4},{color:"#95CFFC", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#A5AEC1", v:7,c:2},{color:"#93B1CF", v:7,c:4},{color:"#7EB3DD", v:7,c:6},{color:"#62B5ED", v:7,c:8},{color:"#2EB8FE", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#8A94A6", v:6,c:2},{color:"#7996B3", v:6,c:4},{color:"#6399C2", v:6,c:6},{color:"#469BD0", v:6,c:8},{color:"#7b7b7b", v:5,c:0},{color:"#707B8C", v:5,c:2},{color:"#5F7D99", v:5,c:4},{color:"#497FA6", v:5,c:6},{color:"#2180B4", v:5,c:8},{color:"#626262", v:4,c:0},{color:"#566272", v:4,c:2},{color:"#45647F", v:4,c:4},{color:"#2C668C", v:4,c:6},{color:"#4a4a4a", v:3,c:0},{color:"#3D4B5B", v:3,c:2},{color:"#2A4D68", v:3,c:4},{color:"#323232", v:2,c:0},{color:"#2A3643", v:2,c:2},{color:"#15374E", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#162330", v:1,c:2}];
		case 'hue2_5_PB': return [{color:"#e5e5e5", v:9,c:0},{color:"#E1E3FA", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#C4C8DD", v:8,c:2},{color:"#B5C9EE", v:8,c:4},{color:"#A2CBFF", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#A8ADC1", v:7,c:2},{color:"#9BAED0", v:7,c:4},{color:"#8BB0DF", v:7,c:6},{color:"#78B1EF", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#8D93A6", v:6,c:2},{color:"#8194B4", v:6,c:4},{color:"#7196C3", v:6,c:6},{color:"#5E97D2", v:6,c:8},{color:"#4298E2", v:6,c:10},{color:"#7b7b7b", v:5,c:0},{color:"#737A8C", v:5,c:2},{color:"#667B9A", v:5,c:4},{color:"#567CA8", v:5,c:6},{color:"#417DB7", v:5,c:8},{color:"#157EC5", v:5,c:10},{color:"#626262", v:4,c:0},{color:"#596173", v:4,c:2},{color:"#4C6281", v:4,c:4},{color:"#3C638E", v:4,c:6},{color:"#1C649C", v:4,c:8},{color:"#4a4a4a", v:3,c:0},{color:"#414A5C", v:3,c:2},{color:"#334B69", v:3,c:4},{color:"#1B4B76", v:3,c:6},{color:"#323232", v:2,c:0},{color:"#2D3543", v:2,c:2},{color:"#1F3550", v:2,c:4},{color:"#1b1b1b", v:1,c:0},{color:"#192230", v:1,c:2}];
		case 'hue5_PB': return [{color:"#e5e5e5", v:9,c:0},{color:"#E3E2FA", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#C7C7DD", v:8,c:2},{color:"#BCC7EE", v:8,c:4},{color:"#aeaeae", v:7,c:0},{color:"#ABACC2", v:7,c:2},{color:"#A2ADD1", v:7,c:4},{color:"#96ADE0", v:7,c:6},{color:"#89AEF1", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#9092A7", v:6,c:2},{color:"#8892B5", v:6,c:4},{color:"#7D93C5", v:6,c:6},{color:"#7093D3", v:6,c:8},{color:"#6093E2", v:6,c:10},{color:"#4594F3", v:6,c:12},{color:"#7b7b7b", v:5,c:0},{color:"#76798D", v:5,c:2},{color:"#6E799A", v:5,c:4},{color:"#6379A9", v:5,c:6},{color:"#5579B7", v:5,c:8},{color:"#4379C6", v:5,c:10},{color:"#217AD4", v:5,c:12},{color:"#626262", v:4,c:0},{color:"#5D6074", v:4,c:2},{color:"#546081", v:4,c:4},{color:"#49608E", v:4,c:6},{color:"#39609D", v:4,c:8},{color:"#1F60AA", v:4,c:10},{color:"#4a4a4a", v:3,c:0},{color:"#44495C", v:3,c:2},{color:"#3B496A", v:3,c:4},{color:"#2D4977", v:3,c:6},{color:"#174983", v:3,c:8},{color:"#323232", v:2,c:0},{color:"#303444", v:2,c:2},{color:"#273450", v:2,c:4},{color:"#16345D", v:2,c:6},{color:"#1b1b1b", v:1,c:0},{color:"#1C2231", v:1,c:2},{color:"#12213B", v:1,c:4}];
		case 'hue7_5_PB': return [{color:"#e5e5e5", v:9,c:0},{color:"#E7E1FA", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#CBC6DD", v:8,c:2},{color:"#C5C5ED", v:8,c:4},{color:"#aeaeae", v:7,c:0},{color:"#AFABC1", v:7,c:2},{color:"#AAAAD0", v:7,c:4},{color:"#A5A9E0", v:7,c:6},{color:"#9FA8F1", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#9491A7", v:6,c:2},{color:"#9090B5", v:6,c:4},{color:"#8B8FC4", v:6,c:6},{color:"#868ED2", v:6,c:8},{color:"#818CE0", v:6,c:10},{color:"#798AF1", v:6,c:12},{color:"#7b7b7b", v:5,c:0},{color:"#7A788D", v:5,c:2},{color:"#76779A", v:5,c:4},{color:"#7175A9", v:5,c:6},{color:"#6D74B7", v:5,c:8},{color:"#6772C4", v:5,c:10},{color:"#6170D3", v:5,c:12},{color:"#5A6EE1", v:5,c:14},{color:"#526BF0", v:5,c:16},{color:"#626262", v:4,c:0},{color:"#615F74", v:4,c:2},{color:"#5D5E81", v:4,c:4},{color:"#595C8E", v:4,c:6},{color:"#545B9C", v:4,c:8},{color:"#4F59A9", v:4,c:10},{color:"#4957B6", v:4,c:12},{color:"#4454C3", v:4,c:14},{color:"#4050D0", v:4,c:16},{color:"#3D4BDD", v:4,c:18},{color:"#3B44EC", v:4,c:20},{color:"#3B3EF7", v:4,c:22},{color:"#4a4a4a", v:3,c:0},{color:"#49485C", v:3,c:2},{color:"#45466A", v:3,c:4},{color:"#414577", v:3,c:6},{color:"#3D4383", v:3,c:8},{color:"#38408F", v:3,c:10},{color:"#353D9B", v:3,c:12},{color:"#3338A8", v:3,c:14},{color:"#3332B4", v:3,c:16},{color:"#342BBE", v:3,c:18},{color:"#3522C8", v:3,c:20},{color:"#370ED3", v:3,c:22},{color:"#323232", v:2,c:0},{color:"#343345", v:2,c:2},{color:"#313150", v:2,c:4},{color:"#2D2F5C", v:2,c:6},{color:"#2A2D68", v:2,c:8},{color:"#282974", v:2,c:10},{color:"#28247D", v:2,c:12},{color:"#291D87", v:2,c:14},{color:"#2C1191", v:2,c:16},{color:"#1b1b1b", v:1,c:0},{color:"#212031", v:1,c:2},{color:"#1F1F3B", v:1,c:4},{color:"#1D1C46", v:1,c:6},{color:"#1D184F", v:1,c:8},{color:"#1E1158", v:1,c:10}];
		case 'hue10_PB': return [{color:"#e5e5e5", v:9,c:0},{color:"#EAE0F9", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#CDC5DC", v:8,c:2},{color:"#CCC3EC", v:8,c:4},{color:"#CBC1FE", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#B2AAC1", v:7,c:2},{color:"#B1A8D0", v:7,c:4},{color:"#B0A6DE", v:7,c:6},{color:"#AFA3EE", v:7,c:8},{color:"#AFA0FE", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#9790A6", v:6,c:2},{color:"#978EB4", v:6,c:4},{color:"#968CC2", v:6,c:6},{color:"#9689CF", v:6,c:8},{color:"#9687DD", v:6,c:10},{color:"#9583EC", v:6,c:12},{color:"#957FFA", v:6,c:14},{color:"#7b7b7b", v:5,c:0},{color:"#7D778C", v:5,c:2},{color:"#7D7599", v:5,c:4},{color:"#7D72A7", v:5,c:6},{color:"#7D6FB4", v:5,c:8},{color:"#7E6CC0", v:5,c:10},{color:"#7E69CD", v:5,c:12},{color:"#7F65DA", v:5,c:14},{color:"#7F60E7", v:5,c:16},{color:"#815BF3", v:5,c:18},{color:"#8354FF", v:5,c:20},{color:"#626262", v:4,c:0},{color:"#645E74", v:4,c:2},{color:"#655C80", v:4,c:4},{color:"#65598D", v:4,c:6},{color:"#655699", v:4,c:8},{color:"#6653A5", v:4,c:10},{color:"#674FB1", v:4,c:12},{color:"#684ABC", v:4,c:14},{color:"#6B44C7", v:4,c:16},{color:"#6E3DD2", v:4,c:18},{color:"#7133DE", v:4,c:20},{color:"#7429E7", v:4,c:22},{color:"#7815F1", v:4,c:24},{color:"#4a4a4a", v:3,c:0},{color:"#4D465C", v:3,c:2},{color:"#4D4469", v:3,c:4},{color:"#4E4174", v:3,c:6},{color:"#4F3D7F", v:3,c:8},{color:"#51398B", v:3,c:10},{color:"#533495", v:3,c:12},{color:"#562DA0", v:3,c:14},{color:"#5923AA", v:3,c:16},{color:"#5D14B4", v:3,c:18},{color:"#323232", v:2,c:0},{color:"#373244", v:2,c:2},{color:"#382F4F", v:2,c:4},{color:"#3A2C59", v:2,c:6},{color:"#3B2864", v:2,c:8},{color:"#3E226E", v:2,c:10},{color:"#411B76", v:2,c:12},{color:"#440C80", v:2,c:14},{color:"#1b1b1b", v:1,c:0},{color:"#251F31", v:1,c:2},{color:"#261C3A", v:1,c:4},{color:"#281843", v:1,c:6},{color:"#2A134B", v:1,c:8},{color:"#2D0453", v:1,c:10}];
		case 'hue2_5_P': return [{color:"#e5e5e5", v:9,c:0},{color:"#ECE0F9", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#D0C4DB", v:8,c:2},{color:"#D2C1EA", v:8,c:4},{color:"#D5BEFA", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#B4A9C0", v:7,c:2},{color:"#B7A6CE", v:7,c:4},{color:"#BAA3DB", v:7,c:6},{color:"#BDA0E8", v:7,c:8},{color:"#C19BF7", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#9A8FA6", v:6,c:2},{color:"#9C8CB2", v:6,c:4},{color:"#9F89BF", v:6,c:6},{color:"#A386CB", v:6,c:8},{color:"#A781D8", v:6,c:10},{color:"#AB7DE4", v:6,c:12},{color:"#AF77F0", v:6,c:14},{color:"#B571FD", v:6,c:16},{color:"#7b7b7b", v:5,c:0},{color:"#80768B", v:5,c:2},{color:"#837398", v:5,c:4},{color:"#866FA4", v:5,c:6},{color:"#8A6BB0", v:5,c:8},{color:"#8D67BA", v:5,c:10},{color:"#9262C6", v:5,c:12},{color:"#965DD0", v:5,c:14},{color:"#9B56DB", v:5,c:16},{color:"#9F4FE5", v:5,c:18},{color:"#A546F1", v:5,c:20},{color:"#AA3AFC", v:5,c:22},{color:"#626262", v:4,c:0},{color:"#675D73", v:4,c:2},{color:"#6B5A7F", v:4,c:4},{color:"#6E5689", v:4,c:6},{color:"#725294", v:4,c:8},{color:"#764E9E", v:4,c:10},{color:"#7A48A9", v:4,c:12},{color:"#7F41B3", v:4,c:14},{color:"#8339BD", v:4,c:16},{color:"#892EC7", v:4,c:18},{color:"#8E1CD2", v:4,c:20},{color:"#4a4a4a", v:3,c:0},{color:"#50455B", v:3,c:2},{color:"#544266", v:3,c:4},{color:"#573E71", v:3,c:6},{color:"#5B397A", v:3,c:8},{color:"#603385", v:3,c:10},{color:"#642C8D", v:3,c:12},{color:"#692197", v:3,c:14},{color:"#6E0BA1", v:3,c:16},{color:"#323232", v:2,c:0},{color:"#3A3143", v:2,c:2},{color:"#3D2E4D", v:2,c:4},{color:"#412A55", v:2,c:6},{color:"#46245F", v:2,c:8},{color:"#4A1C67", v:2,c:10},{color:"#4F0E70", v:2,c:12},{color:"#1b1b1b", v:1,c:0},{color:"#281E30", v:1,c:2},{color:"#2B1A38", v:1,c:4},{color:"#2F153F", v:1,c:6},{color:"#330C47", v:1,c:8}];
		case 'hue5_P': return [{color:"#e5e5e5", v:9,c:0},{color:"#EDDFF7", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#D1C4DA", v:8,c:2},{color:"#D7C0E8", v:8,c:4},{color:"#DDBCF5", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#B7A9BF", v:7,c:2},{color:"#BCA5CB", v:7,c:4},{color:"#C1A1D7", v:7,c:6},{color:"#C79DE3", v:7,c:8},{color:"#CE98EF", v:7,c:10},{color:"#D492FC", v:7,c:12},{color:"#959595", v:6,c:0},{color:"#9C8FA5", v:6,c:2},{color:"#A28BAF", v:6,c:4},{color:"#A887BB", v:6,c:6},{color:"#AD83C6", v:6,c:8},{color:"#B37ED1", v:6,c:10},{color:"#B978DB", v:6,c:12},{color:"#C072E6", v:6,c:14},{color:"#C66AF1", v:6,c:16},{color:"#CC62FC", v:6,c:18},{color:"#7b7b7b", v:5,c:0},{color:"#82758A", v:5,c:2},{color:"#887195", v:5,c:4},{color:"#8E6DA0", v:5,c:6},{color:"#9468AA", v:5,c:8},{color:"#9963B4", v:5,c:10},{color:"#9F5DBE", v:5,c:12},{color:"#A557C8", v:5,c:14},{color:"#AB4FD1", v:5,c:16},{color:"#B146DB", v:5,c:18},{color:"#B83AE5", v:5,c:20},{color:"#BE27EF", v:5,c:22},{color:"#626262", v:4,c:0},{color:"#6A5C72", v:4,c:2},{color:"#70587C", v:4,c:4},{color:"#755485", v:4,c:6},{color:"#7A4F8F", v:4,c:8},{color:"#804A98", v:4,c:10},{color:"#8643A1", v:4,c:12},{color:"#8C3BAB", v:4,c:14},{color:"#932FB4", v:4,c:16},{color:"#981FBD", v:4,c:18},{color:"#4a4a4a", v:3,c:0},{color:"#53455A", v:3,c:2},{color:"#594064", v:3,c:4},{color:"#5E3C6D", v:3,c:6},{color:"#643676", v:3,c:8},{color:"#6A2E7F", v:3,c:10},{color:"#702488", v:3,c:12},{color:"#751490", v:3,c:14},{color:"#323232", v:2,c:0},{color:"#3C3042", v:2,c:2},{color:"#412C4A", v:2,c:4},{color:"#462852", v:2,c:6},{color:"#4C205B", v:2,c:8},{color:"#511762", v:2,c:10},{color:"#1b1b1b", v:1,c:0},{color:"#2A1D2F", v:1,c:2},{color:"#2F1936", v:1,c:4},{color:"#33133D", v:1,c:6}];
		case 'hue7_5_P': return [{color:"#e5e5e5", v:9,c:0},{color:"#F1DFF5", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#D4C3D8", v:8,c:2},{color:"#DFBEE2", v:8,c:4},{color:"#E8B9EB", v:8,c:6},{color:"#F4B2F7", v:8,c:8},{color:"#aeaeae", v:7,c:0},{color:"#BAA8BC", v:7,c:2},{color:"#C3A3C6", v:7,c:4},{color:"#CC9ECF", v:7,c:6},{color:"#D699D9", v:7,c:8},{color:"#DF92E3", v:7,c:10},{color:"#E88CEC", v:7,c:12},{color:"#F184F6", v:7,c:14},{color:"#959595", v:6,c:0},{color:"#A08EA2", v:6,c:2},{color:"#A889AB", v:6,c:4},{color:"#B184B4", v:6,c:6},{color:"#B97FBD", v:6,c:8},{color:"#C278C6", v:6,c:10},{color:"#CA72CF", v:6,c:12},{color:"#D26AD8", v:6,c:14},{color:"#DA61E1", v:6,c:16},{color:"#E257E9", v:6,c:18},{color:"#EC47F4", v:6,c:20},{color:"#F532FE", v:6,c:22},{color:"#7b7b7b", v:5,c:0},{color:"#857588", v:5,c:2},{color:"#8E7091", v:5,c:4},{color:"#966B9A", v:5,c:6},{color:"#9F65A3", v:5,c:8},{color:"#A65FAB", v:5,c:10},{color:"#AE58B4", v:5,c:12},{color:"#B54FBC", v:5,c:14},{color:"#BD45C4", v:5,c:16},{color:"#C438CD", v:5,c:18},{color:"#CC24D5", v:5,c:20},{color:"#626262", v:4,c:0},{color:"#6D5B70", v:4,c:2},{color:"#755778", v:4,c:4},{color:"#7C5280", v:4,c:6},{color:"#834C88", v:4,c:8},{color:"#8A4590", v:4,c:10},{color:"#913D98", v:4,c:12},{color:"#9932A1", v:4,c:14},{color:"#A122A9", v:4,c:16},{color:"#4a4a4a", v:3,c:0},{color:"#564458", v:3,c:2},{color:"#5D3F60", v:3,c:4},{color:"#643968", v:3,c:6},{color:"#6B3271", v:3,c:8},{color:"#722979", v:3,c:10},{color:"#791B81", v:3,c:12},{color:"#323232", v:2,c:0},{color:"#3E3041", v:2,c:2},{color:"#452B48", v:2,c:4},{color:"#4A264F", v:2,c:6},{color:"#511E57", v:2,c:8},{color:"#57105E", v:2,c:10},{color:"#1b1b1b", v:1,c:0},{color:"#2C1D2E", v:1,c:2},{color:"#311835", v:1,c:4},{color:"#36113B", v:1,c:6}];
		case 'hue10_P': return [{color:"#e5e5e5", v:9,c:0},{color:"#F3DEF3", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#D6C3D6", v:8,c:2},{color:"#E3BDDD", v:8,c:4},{color:"#F0B7E5", v:8,c:6},{color:"#FDAFEE", v:8,c:8},{color:"#aeaeae", v:7,c:0},{color:"#BCA8BB", v:7,c:2},{color:"#C7A2C2", v:7,c:4},{color:"#D39CC9", v:7,c:6},{color:"#DF96D1", v:7,c:8},{color:"#EA8FD8", v:7,c:10},{color:"#F487DF", v:7,c:12},{color:"#FE7EE7", v:7,c:14},{color:"#959595", v:6,c:0},{color:"#A28DA0", v:6,c:2},{color:"#AC89A7", v:6,c:4},{color:"#B782AE", v:6,c:6},{color:"#C17CB5", v:6,c:8},{color:"#CC75BC", v:6,c:10},{color:"#D56EC3", v:6,c:12},{color:"#E064CB", v:6,c:14},{color:"#E95AD2", v:6,c:16},{color:"#F24ED9", v:6,c:18},{color:"#FC3AE1", v:6,c:20},{color:"#7b7b7b", v:5,c:0},{color:"#877486", v:5,c:2},{color:"#926F8D", v:5,c:4},{color:"#9D6994", v:5,c:6},{color:"#A7629B", v:5,c:8},{color:"#AF5BA2", v:5,c:10},{color:"#B952A9", v:5,c:12},{color:"#C248AF", v:5,c:14},{color:"#CA3CB6", v:5,c:16},{color:"#D329BD", v:5,c:18},{color:"#626262", v:4,c:0},{color:"#6F5B6D", v:4,c:2},{color:"#795674", v:4,c:4},{color:"#82507B", v:4,c:6},{color:"#8B4982", v:4,c:8},{color:"#934188", v:4,c:10},{color:"#9B388F", v:4,c:12},{color:"#A42A96", v:4,c:14},{color:"#AB129C", v:4,c:16},{color:"#4a4a4a", v:3,c:0},{color:"#584356", v:3,c:2},{color:"#613E5D", v:3,c:4},{color:"#693864", v:3,c:6},{color:"#712F6B", v:3,c:8},{color:"#792472", v:3,c:10},{color:"#810D79", v:3,c:12},{color:"#323232", v:2,c:0},{color:"#402F3F", v:2,c:2},{color:"#472A45", v:2,c:4},{color:"#4E254B", v:2,c:6},{color:"#551B53", v:2,c:8},{color:"#5C0559", v:2,c:10},{color:"#1b1b1b", v:1,c:0},{color:"#2D1C2D", v:1,c:2},{color:"#331733", v:1,c:4},{color:"#380F39", v:1,c:6}];
		case 'hue2_5_RP': return [{color:"#e5e5e5", v:9,c:0},{color:"#F4DEF1", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#D8C3D4", v:8,c:2},{color:"#E7BCD9", v:8,c:4},{color:"#F7B5DD", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#BEA7B9", v:7,c:2},{color:"#CBA2BD", v:7,c:4},{color:"#D99BC2", v:7,c:6},{color:"#E793C7", v:7,c:8},{color:"#F38CCB", v:7,c:10},{color:"#FF83D1", v:7,c:12},{color:"#959595", v:6,c:0},{color:"#A48D9E", v:6,c:2},{color:"#B088A2", v:6,c:4},{color:"#BD81A7", v:6,c:6},{color:"#C87AAB", v:6,c:8},{color:"#D473B0", v:6,c:10},{color:"#DF6AB5", v:6,c:12},{color:"#EB5FBB", v:6,c:14},{color:"#F652C0", v:6,c:16},{color:"#7b7b7b", v:5,c:0},{color:"#897484", v:5,c:2},{color:"#966E88", v:5,c:4},{color:"#A2678D", v:5,c:6},{color:"#AE5F92", v:5,c:8},{color:"#B85897", v:5,c:10},{color:"#C34D9C", v:5,c:12},{color:"#CD41A1", v:5,c:14},{color:"#D632A6", v:5,c:16},{color:"#E012AB", v:5,c:18},{color:"#626262", v:4,c:0},{color:"#715A6B", v:4,c:2},{color:"#7D556F", v:4,c:4},{color:"#884E74", v:4,c:6},{color:"#924679", v:4,c:8},{color:"#9B3D7E", v:4,c:10},{color:"#A53183", v:4,c:12},{color:"#AE2088", v:4,c:14},{color:"#4a4a4a", v:3,c:0},{color:"#5A4353", v:3,c:2},{color:"#653D58", v:3,c:4},{color:"#6E365D", v:3,c:6},{color:"#782C62", v:3,c:8},{color:"#811E67", v:3,c:10},{color:"#323232", v:2,c:0},{color:"#422E3D", v:2,c:2},{color:"#4A2942", v:2,c:4},{color:"#522346", v:2,c:6},{color:"#5B174C", v:2,c:8},{color:"#1b1b1b", v:1,c:0},{color:"#2E1C2C", v:1,c:2},{color:"#351631", v:1,c:4},{color:"#3A0D36", v:1,c:6}];
		case 'hue5_RP': return [{color:"#e5e5e5", v:9,c:0},{color:"#F6DEEF", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#D9C2D2", v:8,c:2},{color:"#EBBCD3", v:8,c:4},{color:"#FDB4D4", v:8,c:6},{color:"#aeaeae", v:7,c:0},{color:"#BFA7B6", v:7,c:2},{color:"#CFA1B7", v:7,c:4},{color:"#DF9AB9", v:7,c:6},{color:"#EE92BA", v:7,c:8},{color:"#FB8ABC", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#A58D9B", v:6,c:2},{color:"#B4879D", v:6,c:4},{color:"#C3809E", v:6,c:6},{color:"#CF78A0", v:6,c:8},{color:"#DB71A2", v:6,c:10},{color:"#E966A4", v:6,c:12},{color:"#F55AA6", v:6,c:14},{color:"#7b7b7b", v:5,c:0},{color:"#8B7381", v:5,c:2},{color:"#996D82", v:5,c:4},{color:"#A76684", v:5,c:6},{color:"#B55D86", v:5,c:8},{color:"#C05589", v:5,c:10},{color:"#CC498B", v:5,c:12},{color:"#D73B8D", v:5,c:14},{color:"#E22690", v:5,c:16},{color:"#626262", v:4,c:0},{color:"#735A68", v:4,c:2},{color:"#80546A", v:4,c:4},{color:"#8D4C6C", v:4,c:6},{color:"#98446F", v:4,c:8},{color:"#A23B71", v:4,c:10},{color:"#AD2C74", v:4,c:12},{color:"#B71277", v:4,c:14},{color:"#4a4a4a", v:3,c:0},{color:"#5B4350", v:3,c:2},{color:"#683C53", v:3,c:4},{color:"#733456", v:3,c:6},{color:"#7D2959", v:3,c:8},{color:"#87185D", v:3,c:10},{color:"#323232", v:2,c:0},{color:"#442E3B", v:2,c:2},{color:"#4C293E", v:2,c:4},{color:"#552242", v:2,c:6},{color:"#5E1446", v:2,c:8},{color:"#1b1b1b", v:1,c:0},{color:"#2F1B2A", v:1,c:2},{color:"#37152E", v:1,c:4},{color:"#3D0A33", v:1,c:6}];
		case 'hue7_5_RP': return [{color:"#e5e5e5", v:9,c:0},{color:"#F7DEEE", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#DAC2D1", v:8,c:2},{color:"#EDBBCF", v:8,c:4},{color:"#aeaeae", v:7,c:0},{color:"#C1A7B5", v:7,c:2},{color:"#D1A1B3", v:7,c:4},{color:"#E299B2", v:7,c:6},{color:"#F191B2", v:7,c:8},{color:"#FF89B1", v:7,c:10},{color:"#959595", v:6,c:0},{color:"#A68D99", v:6,c:2},{color:"#B68798", v:6,c:4},{color:"#C67F98", v:6,c:6},{color:"#D37897", v:6,c:8},{color:"#E06F97", v:6,c:10},{color:"#EE6597", v:6,c:12},{color:"#FB5898", v:6,c:14},{color:"#7b7b7b", v:5,c:0},{color:"#8C737F", v:5,c:2},{color:"#9C6D7E", v:5,c:4},{color:"#AA657E", v:5,c:6},{color:"#B85D7E", v:5,c:8},{color:"#C4537E", v:5,c:10},{color:"#D2467E", v:5,c:12},{color:"#DC387F", v:5,c:14},{color:"#E81F80", v:5,c:16},{color:"#626262", v:4,c:0},{color:"#755A65", v:4,c:2},{color:"#825465", v:4,c:4},{color:"#904C65", v:4,c:6},{color:"#9C4366", v:4,c:8},{color:"#A63866", v:4,c:10},{color:"#B22967", v:4,c:12},{color:"#4a4a4a", v:3,c:0},{color:"#5D424E", v:3,c:2},{color:"#6A3B4E", v:3,c:4},{color:"#75334F", v:3,c:6},{color:"#812751", v:3,c:8},{color:"#8B1452", v:3,c:10},{color:"#323232", v:2,c:0},{color:"#442E39", v:2,c:2},{color:"#4E283B", v:2,c:4},{color:"#57213E", v:2,c:6},{color:"#611241", v:2,c:8},{color:"#1b1b1b", v:1,c:0},{color:"#301B28", v:1,c:2},{color:"#38142C", v:1,c:4},{color:"#3F062F", v:1,c:6}];
		case 'hue10_RP': return [{color:"#e5e5e5", v:9,c:0},{color:"#F8DDEC", v:9,c:2},{color:"#c9c9c9", v:8,c:0},{color:"#DBC2CF", v:8,c:2},{color:"#F0BBCB", v:8,c:4},{color:"#aeaeae", v:7,c:0},{color:"#C2A7B3", v:7,c:2},{color:"#D3A0AF", v:7,c:4},{color:"#E499AC", v:7,c:6},{color:"#F491A8", v:7,c:8},{color:"#959595", v:6,c:0},{color:"#A78D97", v:6,c:2},{color:"#B88694", v:6,c:4},{color:"#C97F91", v:6,c:6},{color:"#D6788E", v:6,c:8},{color:"#E46E8C", v:6,c:10},{color:"#F26489", v:6,c:12},{color:"#FF5888", v:6,c:14},{color:"#7b7b7b", v:5,c:0},{color:"#8D737D", v:5,c:2},{color:"#9E6D7A", v:5,c:4},{color:"#AD6577", v:5,c:6},{color:"#BB5C75", v:5,c:8},{color:"#C85373", v:5,c:10},{color:"#D54571", v:5,c:12},{color:"#E03770", v:5,c:14},{color:"#EC196F", v:5,c:16},{color:"#626262", v:4,c:0},{color:"#755A63", v:4,c:2},{color:"#845361", v:4,c:4},{color:"#914C5F", v:4,c:6},{color:"#9E425D", v:4,c:8},{color:"#A9375C", v:4,c:10},{color:"#B5265B", v:4,c:12},{color:"#4a4a4a", v:3,c:0},{color:"#5E424B", v:3,c:2},{color:"#6B3B4A", v:3,c:4},{color:"#773348", v:3,c:6},{color:"#832648", v:3,c:8},{color:"#8E0F47", v:3,c:10},{color:"#323232", v:2,c:0},{color:"#452E38", v:2,c:2},{color:"#4F2838", v:2,c:4},{color:"#592039", v:2,c:6},{color:"#630F3B", v:2,c:8},{color:"#1b1b1b", v:1,c:0},{color:"#311B27", v:1,c:2},{color:"#391429", v:1,c:4}];
	}
	return '';
}

/**
 * 明度vの色の配列を返す
 * @param {String} hue_id
 * @param {Number} v
 * @returns {munsell_json|Array}
 */
function getSameValueMunsellJSON(hue_id, v) {
	var munsell_json = getMunsellJSON(hue_id);
	var same_value = new Array();
	for (var i=0; i<munsell_json.length; i++) {
		if (munsell_json[i].v === v) {
			same_value.push(munsell_json[i]);
		} 
	}
	return same_value;
}

/**
 * 彩度cの色の配列を返す
 * @param {String} hue_id
 * @param {Number} c
 * @returns {munsell_json|Array}
 */
function getSameChromaMunsellJSON(hue_id, c) {
	var munsell_json = getMunsellJSON(hue_id);
	var same_chroma = new Array();
	for (var i=0; i<munsell_json.length; i++) {
		if (munsell_json[i].c === c) {
			same_chroma.push(munsell_json[i]);
		} 
	}
	return same_chroma;
}

/**
 * 最高彩度のうち最高明度の色を返す
 * @param {String} hue_id
 * @returns {munsell_json}
 */
function getHighestCHighestVMunsellJSON(hue_id) {
	var highest_c = getHighestChroma(hue_id);
	var highest_v = getHighestValue(hue_id, highest_c);
	var munsell_json = getMunsellJSON(hue_id);
	for(var i in munsell_json) {
		if (munsell_json[i].v === highest_v && munsell_json[i].c === highest_c) {
			return munsell_json[i];
		}
	}
	return null;
}

/**
 * 明度vのうち彩度がcまたはそれ以下の色
 * @param {String} hue_id
 * @param {Number} v
 * @param {Number} c
 * @returns {ColorInfo}
 */
function getLessChroma(hue_id, v, c) {
	var color_info = new ColorInfo();
	var v_array = getSameValueMunsellJSON(hue_id, v);
	var highest_c = 0;
	for (var i=0; i<v_array.length; i++) {
		if (highest_c < v_array[i].c) {
			highest_c = v_array[i].c;
		}	
	}
	for (var i=0; i<v_array.length; i++) {
		if (highest_c >= c) {
			if (v_array[i].c === c) {
				color_info.c = c;
				color_info.hex = v_array[i].color;
			} 
		} else {
			if (v_array[i].c === highest_c) {
				color_info.c = v_array[i].c;
				color_info.hex = v_array[i].color;
			} 
		}
	}
	color_info.v = v;
	return color_info;
}

/**
 * 彩度cのうち明度がvの色（ない場合は最も近い明度の色）
 * @param {String} hue_id
 * @param {Number} v
 * @param {Number} c
 * @returns {ColorInfo}
 */
function getNearestValue(hue_id, v, c) {
	var color_info = new ColorInfo();
	var c_array = getSameChromaMunsellJSON(hue_id, c);
	var highest_v = 0;
	for (var i=0; i<c_array.length; i++) {
		if (highest_v < c_array[i].v) {
			highest_v = c_array[i].v;
		}	
	}
	var v_exist = false;
	var tmp_v = v;
	while (!(v_exist)) {
		for (var i=0; i<c_array.length; i++) {
			if (c_array[i].v === tmp_v) {
				color_info.v = c_array[i].v;
				color_info.hex = c_array[i].color;
				v_exist = true;
				break;
			}
		}
		if (highest_v > v) {
			tmp_v++;
		} else {
			tmp_v--;
		}
	}
	
	color_info.c = c;
	return color_info;
}

/**
 * 明度v, 彩度cの色
  * @param {String} hue_id
 * @param {Number} v
 * @param {Number} c
 * @returns {ColorInfo}
 */
function getVC(hue_id, v, c) {
	var color_info = new ColorInfo();
	var munsell_json = getMunsellJSON(hue_id);
	for (var i=0; i<munsell_json.length; i++) {
		if (munsell_json[i].v === v && munsell_json[i].c === c) {
			color_info.v = munsell_json[i].v;
			color_info.c = munsell_json[i].c;
			color_info.hex = munsell_json[i].color;
			return color_info;
		}	
	}
	return null;
}

/**
 * 同一色相内の最高彩度を取得
 * @param {String} hue_id
 * @returns {Number}
 */
function getHighestChroma(hue_id) {
	var munsell_json = getMunsellJSON(hue_id);
	var highest_c = 0;
	for(var i in munsell_json) {
		var test_c = munsell_json[i].c;
		if (munsell_json[i].c > highest_c) {
			highest_c = munsell_json[i].c;
		}
	}
	return highest_c;
}

/**
 * 明度vのうち最高彩度を取得
 * @param {String} hue_id
 * @param {Number} v
 * @returns {Number}
 */
function getHighestChromaInV(hue_id, v) {
	var munsell_json = getMunsellJSON(hue_id);
	var highest_c = 0;
	for(var i in munsell_json) {
		if (munsell_json[i].v === v) {
			if (munsell_json[i].c > highest_c) {
				highest_c = munsell_json[i].c;
			}
		}
	}
	return highest_c;
}

/**
 * 同一色相内の最高明度を取得
 * @param {String} hue_id
 * @param {Number} chroma
 * @returns {Number}
 */
function getHighestValue(hue_id, chroma) {
	var munsell_json = getMunsellJSON(hue_id);
	var highest_v = -1;
	for(var i in munsell_json) {
		if (munsell_json[i].c === chroma) {
			if (munsell_json[i].v > highest_v) {
				highest_v = munsell_json[i].v;
			}
		}
	}
	return highest_v;
}

/**
 * 色相環を反時計回りにi色先を取得
 * @param {String} o_hue_id 元の色相のhue_id
 * @param {Number} i
 * @returns {hue_id}
 */
function getFartherColor(o_hue_id, i) {
        var hue_id_list = getHueIDList();
        var o_hue_num = -1;
	for (var j=0; j< hue_id_list.length; j++) {
		if (hue_id_list[j] === o_hue_id) {
			 o_hue_num = j;
                         break;
		}
	}
	if (o_hue_num === -1) { 
            return null; 
        }
	var t_hue_num = o_hue_num - i;
	if (t_hue_num < 0) {
		t_hue_num = t_hue_num + 40;
	}	
        if (t_hue_num < 0 || t_hue_num > 40) {
		return null;
	}
	var hue_id_list = getHueIDList();
	return hue_id_list[t_hue_num];     
}

/**
 * min_cとmax_cの中間の彩度（切り上げ）
 * @param {Number} min_c
 * @param {Number} max_c
 * @returns {Number}
 */
function getMidChroma(min_c, max_c) {
	var mid_c = (max_c + min_c) / 2;
	if (mid_c % 2 === 0) {
		return mid_c;
	} else {
		return mid_c + 1;
	}
}

/****************************
 * テイスト別色情報取得共通
 ****************************/

getColorByTasteFuncObj = new Array;

/**
 * 色相とテイストから色情報を取得
 * @param {String} hue_id
 * @param {String} taste_id
 * @returns {ColorInfo}
 */
function getColorByTasteId(hue_id, taste_id) {
	taste_id = taste_id.replace('+', '_p');
	taste_id = taste_id.replace('-', '_m');
	return getColorByTasteFuncObj['get' + taste_id](hue_id);
}

/**
 * 色相とテイストから彩度を取得
 * @param {String} hue_id
 * @param {String} taste_id
 * @returns {Number}
 */
function getChromaByTasteId(hue_id, taste_id) {
	taste_id = taste_id.replace('+', '_p');
	taste_id = taste_id.replace('-', '_m');
	var color_info = getColorByTasteFuncObj['get' + taste_id](hue_id);
	return color_info.c;
}

/**
 * 色相とテイストから明度を取得
 * @param {String} hue_id
 * @param {String} taste_id
 * @returns {Number}
 */
function getValueByTasteId(hue_id, taste_id) {
	taste_id = taste_id.replace('+', '_p');
	taste_id = taste_id.replace('-', '_m');
	var color_info = getColorByTasteFuncObj['get' + taste_id](hue_id);
	return color_info.v;
}

/**
 * CUT : 彩度・明度ともSPO+とROMの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get01cut = function(hue_id)
{
	var spop_c = getChromaByTasteId(hue_id, '10spo+');
	var spop_v = getValueByTasteId(hue_id, '10spo+');
	var rom_c = getChromaByTasteId(hue_id, '02rom');
	var rom_v = getValueByTasteId(hue_id, '02rom');
	
	var cut_c = Math.ceil(rom_c + (spop_c - rom_c) / 3);
	if ((cut_c % 2) === 1) { cut_c = cut_c + 1; }
	
	var cut_v = Math.ceil(spop_v + (rom_v - spop_v) / 3 * 2);
		
	var color_info = getNearestValue(hue_id, cut_v, cut_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * ROM : 9/6 → 9/4 → 8/4 → 9/2
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get02rom = function(hue_id)
{
	var color_info = getLessChroma(hue_id, 9, 6);
	var color_info2 = getVC(hue_id, 8, 4);
	color_info.hue_id = hue_id;
	color_info2.hue_id = hue_id;
	if (color_info.c === 2 && color_info2 !== null) {
		return color_info2;
	} else {
		return color_info;
	}
};

/**
 * NOB : 彩度・明度ともELE-とROMの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get03nob = function(hue_id)
{
	var elem_c = getChromaByTasteId(hue_id, '09ele-');
	var elem_v = getValueByTasteId(hue_id, '09ele-');
	var rom_c = getChromaByTasteId(hue_id, '02rom');
	var rom_v = getValueByTasteId(hue_id, '02rom');
	
	var nob_c = Math.floor(elem_c + (rom_c - elem_c) / 3 * 2);
	if ((nob_c % 2) === 1) { nob_c = nob_c - 1; }
	
	var nob_v = Math.floor(elem_v + (rom_v - elem_v) / 3 * 2);
		
	var color_info = getNearestValue(hue_id, nob_v, nob_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * SMO : 彩度・明度ともELE-とROMの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get04smo = function(hue_id)
{
	var elem_c = getChromaByTasteId(hue_id, '09ele-');
	var elem_v = getValueByTasteId(hue_id, '09ele-');
	var rom_c = getChromaByTasteId(hue_id, '02rom');
	var rom_v = getValueByTasteId(hue_id, '02rom');
	
	var smo_c = Math.floor(elem_c + (rom_c - elem_c) / 3);
	if ((smo_c % 2) === 1) { smo_c = smo_c - 1; }
	
	var smo_v = Math.floor(elem_v + (rom_v - elem_v) / 3);
		
	var color_info = getNearestValue(hue_id, smo_v, smo_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * CLS : 彩度・明度ともSPO+とROMの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get05cls = function(hue_id)
{
	var spop_c = getChromaByTasteId(hue_id, '10spo+');
	var spop_v = getValueByTasteId(hue_id, '10spo+');
	var rom_c = getChromaByTasteId(hue_id, '02rom');
	var rom_v = getValueByTasteId(hue_id, '02rom');
	
	var cls_c = Math.ceil(rom_c + (spop_c - rom_c) / 3 * 2);
	if ((cls_c % 2) === 1) { cls_c = cls_c + 1; }
	
	var cls_v = Math.ceil(spop_v + (rom_v - spop_v) / 3);
		
	var color_info = getNearestValue(hue_id, cls_v, cls_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * SCA : 彩度・明度ともSPO+とFEMの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get06sca = function(hue_id)
{
	var spop_c = getChromaByTasteId(hue_id, '10spo+');
	var spop_v = getValueByTasteId(hue_id, '10spo+');
	var fem_c = getChromaByTasteId(hue_id, '07fem');
	var fem_v = getValueByTasteId(hue_id, '07fem');
	
	var sca_c = Math.ceil(fem_c + (spop_c - fem_c) / 3);
	if ((sca_c % 2) === 1) { sca_c = sca_c + 1; }
	
	var sca_v = Math.ceil(spop_v + (fem_v - spop_v) / 3 * 2);
		
	var color_info = getNearestValue(hue_id, sca_v, sca_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * FEM : 明度はROMとNATの中間、彩度はNATに近く
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get07fem = function(hue_id)
{
	var rom_c = getChromaByTasteId(hue_id, '02rom');
	var rom_v = getValueByTasteId(hue_id, '02rom');
	var nat_c = getChromaByTasteId(hue_id, '13nat');
	var nat_v = getValueByTasteId(hue_id, '13nat');
	
	var fem_v = Math.ceil(nat_v + (rom_v - nat_v) / 2);
	
	var color_info = getNearestValue(hue_id, fem_v,  nat_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * SEL : 彩度・明度ともELE-とFEMの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get08sel = function(hue_id)
{
	var elem_c = getChromaByTasteId(hue_id, '09ele-');
	var elem_v = getValueByTasteId(hue_id, '09ele-');
	var fem_c = getChromaByTasteId(hue_id, '07fem');
	var fem_v = getValueByTasteId(hue_id, '07fem');
	
	var sel_c = Math.floor(elem_c + (fem_c - elem_c) / 3 * 2);
	if ((sel_c % 2) === 1) { sel_c = sel_c - 1; }
	
	var sel_v = Math.floor(elem_v + (fem_v - elem_v) / 3 * 2);
		
	var color_info = getNearestValue(hue_id, sel_v, sel_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * SEL- : 彩度・明度ともELE-とROMの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get08sel_m = function(hue_id)
{
	var elem_c = getChromaByTasteId(hue_id, '09ele-');
	var elem_v = getValueByTasteId(hue_id, '09ele-');
	var fem_c = getChromaByTasteId(hue_id, '07fem');
	var fem_v = getValueByTasteId(hue_id, '07fem');
	
	var selm_c = Math.floor(elem_c + (fem_c - elem_c) / 3);
	if ((selm_c % 2) === 1) { selm_c = selm_c - 1; }
	
	var selm_v = Math.floor(elem_v + (fem_v - elem_v) / 3);
		
	var color_info = getNearestValue(hue_id, selm_v, selm_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * ELE: 5/2
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get09ele = function(hue_id)
{
	var color_info = getVC(hue_id, 5, 2);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * ELE-: 6/2
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get09ele_m = function(hue_id)
{
	var color_info = getVC(hue_id, 6, 2);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * ELE+: 4/2
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get09ele_p = function(hue_id)
{
	var color_info = getVC(hue_id, 4, 2);
	color_info.hue_id = hue_id;
	return color_info;

};
/*  
* SPO : 最高彩度の最高明度
*/
/**
 * CUT : 彩度・明度ともSPO+とROMの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get10spo = function(hue_id)
{
	var color_info = new ColorInfo();
	var munsell_json = getHighestCHighestVMunsellJSON(hue_id);
	color_info.c = munsell_json.c;
	color_info.v = munsell_json.v;
	color_info.hex = munsell_json.color;
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * SPO- : SPOより彩度マイナス2、明度マイナス1（ない場合は同彩度、明度マイナス1→その色から彩度を下げていく）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get10spo_m = function(hue_id)
{
	var spo_c = getChromaByTasteId(hue_id, '10spo');
	var spo_v = getValueByTasteId(hue_id, '10spo');
	var spom_c = spo_c - 2;
	var spom_v = spo_v - 1;
	
	var color_info = getVC(hue_id, spom_v, spom_c);
	var tmp_spom_c = spo_c;
	var tmp_spom_v = spom_v;
	while (color_info === null) {
		color_info = getVC(hue_id, tmp_spom_v, tmp_spom_c);
		tmp_spom_c = tmp_spom_c - 2;
	}
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * SPO+ : SPOより彩度マイナス2、明度プラス1（ない場合は彩度マイナス2、同明度）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get10spo_p = function(hue_id)
{
	var spo_c = getChromaByTasteId(hue_id, '10spo');
	var spo_v = getValueByTasteId(hue_id, '10spo');
	var spop_c = spo_c - 2;
	var spop_v = spo_v + 1;
	
	var color_info = getNearestValue(hue_id, spop_v, spop_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * CAS : 彩度はSPOとNATの間を三等分して算出、明度はNATに近く
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get11cas = function(hue_id)
{	
	var spo_c = getChromaByTasteId(hue_id, '10spo');
	var spo_v = getValueByTasteId(hue_id, '10spo');
	var nat_c = getChromaByTasteId(hue_id, '13nat');
	var nat_v = getValueByTasteId(hue_id, '13nat');
	
	var cas_c = Math.ceil(nat_c + (spo_c - nat_c) / 3 * 2);
	if ((cas_c % 2) === 1) { cas_c = cas_c + 1; }
	
	var color_info = getNearestValue(hue_id, nat_v, cas_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * CAS- : 彩度・明度ともSPO-とCLAの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get11cas_m = function(hue_id)
{
	var spom_c = getChromaByTasteId(hue_id, '10spo-');
	var spom_v = getValueByTasteId(hue_id, '10spo-');
	var cla_c = getChromaByTasteId(hue_id, '17cla');
	var cla_v = getValueByTasteId(hue_id, '17cla');
	
	var casm_c = Math.ceil(cla_c + (spom_c - cla_c) / 3 * 2);
	if ((casm_c % 2) === 1) { casm_c = casm_c + 1; }
	
	var casm_v = Math.ceil(cla_v + (spom_v - cla_v) / 3 * 2);
		
	var color_info = getNearestValue(hue_id, casm_v, casm_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * CAS+ : 彩度・明度ともSPO+とFEMの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get11cas_p = function(hue_id)
{
	var spop_c = getChromaByTasteId(hue_id, '10spo+');
	var spop_v = getValueByTasteId(hue_id, '10spo+');
	var fem_c = getChromaByTasteId(hue_id, '07fem');
	var fem_v = getValueByTasteId(hue_id, '07fem');
	
	var casp_c = Math.ceil(fem_c + (spop_c - fem_c) / 3 * 2);
	if ((casp_c % 2) === 1) { casp_c = casp_c + 1; }
	
	var casp_v = Math.ceil(spop_v + (fem_v - spop_v) / 3);
		
	var color_info = getNearestValue(hue_id, casp_v, casp_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * TRA : 彩度はSPOとNATの間を三等分して算出、明度はNAT(5)に近く
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get12tra = function(hue_id)
{
	var spo_c = getChromaByTasteId(hue_id, '10spo');
	var spo_v = getValueByTasteId(hue_id, '10spo');
	var nat_c = getChromaByTasteId(hue_id, '13nat');
	var nat_v = getValueByTasteId(hue_id, '13nat');
	
	var tra_c = Math.ceil(nat_c + (spo_c - nat_c) / 3);
	if ((tra_c % 2) === 1) { tra_c = tra_c + 1; }
	
	var color_info = getNearestValue(hue_id, nat_v, tra_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * NAT : 明度5のうち彩度が中間の色（切り上げ）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get13nat = function(hue_id)
{
	var color_info = new ColorInfo();
	var highest_c = getHighestChromaInV(hue_id, 5);
	var mid_c = getMidChroma(2, highest_c);
	var color_info = getVC(hue_id, 5, mid_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * NAT+ : 彩度はELEとNATの間を三等分して算出、明度はNATに近く
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get13nat_p = function(hue_id)
{
	var ele_c = getChromaByTasteId(hue_id, '09ele');
	var ele_v = getValueByTasteId(hue_id, '09ele');
	var nat_c = getChromaByTasteId(hue_id, '13nat');
	var nat_v = getValueByTasteId(hue_id, '13nat');
	
	var natp_c = Math.floor(ele_c + (nat_c - ele_c) / 3 * 2);
	if ((natp_c % 2) === 1) { natp_c = natp_c - 1; }
	
	var color_info = getNearestValue(hue_id, nat_v, natp_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * ELG : 彩度はELEとNATの間を三等分して算出、明度はNATに近く
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get14elg = function(hue_id)
{
	var ele_c = getChromaByTasteId(hue_id, '09ele');
	var ele_v = getValueByTasteId(hue_id, '09ele');
	var nat_c = getChromaByTasteId(hue_id, '13nat');
	var nat_v = getValueByTasteId(hue_id, '13nat');
	
	var elg_c = Math.floor(ele_c + (nat_c - ele_c) / 3 );
	if ((elg_c % 2) === 1) { elg_c = elg_c - 1; }
	
	var color_info = getNearestValue(hue_id, nat_v, elg_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * DYN : 彩度・明度ともSPO-とDANの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get15dyn = function(hue_id)
{
	var spom_c = getChromaByTasteId(hue_id, '10spo-');
	var spom_v = getValueByTasteId(hue_id, '10spo-');
	var dan_c = getChromaByTasteId(hue_id, '20dan');
	var dan_v = getValueByTasteId(hue_id, '20dan');
	
	var dyn_c = Math.ceil(dan_c + (spom_c - dan_c) / 3 * 2);
	if ((dyn_c % 2) === 1) { dyn_c = dyn_c + 1; }
	
	var dyn_v = Math.ceil(dan_v + (spom_v - dan_v) / 3 * 2);
		
	var color_info = getNearestValue(hue_id, dyn_v, dyn_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * ETH : 彩度・明度ともSPO-とCLAの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get16eth = function(hue_id)
{
	var spom_c = getChromaByTasteId(hue_id, '10spo-');
	var spom_v = getValueByTasteId(hue_id, '10spo-');
	var cla_c = getChromaByTasteId(hue_id, '17cla');
	var cla_v = getValueByTasteId(hue_id, '17cla');
	
	var eth_c = Math.ceil(cla_c + (spom_c - cla_c) / 3);
	if ((eth_c % 2) === 1) { eth_c = eth_c + 1; }
	
	var eth_v = Math.ceil(cla_v + (spom_v - cla_v) / 3);
		
	var color_info = getNearestValue(hue_id, eth_v, eth_c);
	color_info.hue_id = hue_id;
	return color_info;
};
/*
* CLA : 明度はDANとNATの中間、彩度はNATに近く
*/
/**
 * CUT : 彩度・明度ともSPO+とROMの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get17cla = function(hue_id)
{
	var dan_c = getChromaByTasteId(hue_id, '20dan');
	var dan_v = getValueByTasteId(hue_id, '20dan');
	var nat_c = getChromaByTasteId(hue_id, '13nat');
	var nat_v = getValueByTasteId(hue_id, '13nat');
	
	var cla_v = Math.ceil(dan_v + (nat_v - dan_v) / 2);
	
	var color_info = getNearestValue(hue_id, cla_v,  nat_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * GOR : 彩度・明度ともCLAとELE+の間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get18gor = function(hue_id)
{
	var elep_c = getChromaByTasteId(hue_id, '09ele+');
	var elep_v = getValueByTasteId(hue_id, '09ele+');
	var cla_c = getChromaByTasteId(hue_id, '17cla');
	var cla_v = getValueByTasteId(hue_id, '17cla');
	
	var gor_c = Math.floor(elep_c + (cla_c - elep_c) / 3 * 2);
	if ((gor_c % 2) === 1) { gor_c = gor_c - 1; }
	
	var gor_v = Math.floor(cla_v + (elep_v - cla_v) / 3);
		
	var color_info = getNearestValue(hue_id, gor_v, gor_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * GOR- : 彩度・明度ともCLAとELE+の間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get18gor_m = function(hue_id)
{
	var elep_c = getChromaByTasteId(hue_id, '09ele+');
	var elep_v = getValueByTasteId(hue_id, '09ele+');
	var cla_c = getChromaByTasteId(hue_id, '17cla');
	var cla_v = getValueByTasteId(hue_id, '17cla');
	
	var gorm_c = Math.floor(elep_c + (cla_c - elep_c) / 3);
	if ((gorm_c % 2) === 1) { gorm_c = gorm_c - 1; }
	
	var gorm_v = Math.floor(cla_v + (elep_v - cla_v) / 3 * 2);
		
	var color_info = getNearestValue(hue_id, gorm_v, gorm_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * WLD : 彩度・明度ともSPO-とDANの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get19wld = function(hue_id)
{
	var spom_c = getChromaByTasteId(hue_id, '10spo-');
	var spom_v = getValueByTasteId(hue_id, '10spo-');
	var dan_c = getChromaByTasteId(hue_id, '20dan');
	var dan_v = getValueByTasteId(hue_id, '20dan');
	
	var wld_c = Math.ceil(dan_c + (spom_c - dan_c) / 3);
	if ((wld_c % 2) === 1) { wld_c = wld_c + 1; }
	
	var wld_v = Math.ceil(dan_v + (spom_v - dan_v) / 3);
		
	var color_info = getNearestValue(hue_id, wld_v, wld_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * DAN : 1/6 → 1/4 → 1/2
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get20dan = function(hue_id)
{
	var color_info = getLessChroma(hue_id, 1, 6);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * HMO : 彩度・明度ともELE+とDANの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get21hmo = function(hue_id)
{
	var elep_c = getChromaByTasteId(hue_id, '09ele+');
	var elep_v = getValueByTasteId(hue_id, '09ele+');
	var dan_c = getChromaByTasteId(hue_id, '20dan');
	var dan_v = getValueByTasteId(hue_id, '20dan');
	
	var hmo_c = Math.floor(elep_c + (dan_c - elep_c) / 3 * 2);
	if ((hmo_c % 2) === 1) { hmo_c = hmo_c - 1; }
	
	var hmo_v = Math.floor(dan_v + (elep_v - dan_v) / 3);
		
	var color_info = getNearestValue(hue_id, hmo_v, hmo_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/**
 * FOR : 彩度・明度ともELE+とDANの間を三等分して算出
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getColorByTasteFuncObj.get22for = function(hue_id)
{
	var elep_c = getChromaByTasteId(hue_id, '09ele+');
	var elep_v = getValueByTasteId(hue_id, '09ele+');
	var dan_c = getChromaByTasteId(hue_id, '20dan');
	var dan_v = getValueByTasteId(hue_id, '20dan');
	
	var for_c = Math.floor(elep_c + (dan_c - elep_c) / 3);
	if ((for_c % 2) === 1) { for_c = for_c - 1; }
	
	var for_v = Math.floor(dan_v + (elep_v - dan_v) / 3 * 2);
		
	var color_info = getNearestValue(hue_id, for_v, for_c);
	color_info.hue_id = hue_id;
	return color_info;
};

/****************************
 * 三色配色グローブ関連
 ****************************/

/**
 * 三色配色グローブ描画
 * @param {String} tg_hue_id hue_idの先頭に'tg_'がついたもの
 */
function drawTricolorGlobe(tg_hue_id) {
	var hue_id = tg_hue_id.replace('tg_', '');
	
	var taste_json = getTasteJSON();
	for(var i=0; i<taste_json.length; i++) {
		var taste_id = taste_json[i].taste_id;
		if (/[+|-]/.test(taste_id)) { continue; }
		var container_id = 'tg_' + taste_id;
		var element = document.getElementById(container_id);
		element.innerHTML = "";
		addTricolorCell(container_id, taste_id, 1, hue_id, '_tg');
		addTricolorCell(container_id, taste_id, 2, hue_id, '_tg');
		addTricolorCell(container_id, taste_id, 3, hue_id, '_tg');
		element.appendChild(document.createTextNode(taste_id));
	}
}

/****************************
 * テイスト別三色配色関連
 ****************************/

/**
 * テイスト別三色配色描画
 * @param {type} taste_id
 */
function drawTricolor(taste_id) {
	removeElement("tricolor_area");
	var hue_id_list = getHueIDList();
	for (var i=0; i< hue_id_list.length; i++) {
		var row_id = taste_id + '_' + hue_id;
		addDivTag("tricolor_area",  "tricolor_row", row_id, "");
		var hue_id = hue_id_list[i];		
		addTricolorCell(row_id, taste_id, 1, hue_id, '');
		addTricolorCell(row_id, taste_id, 2, hue_id, '');
		addTricolorCell(row_id, taste_id, 3, hue_id, '');
	}
}


/****************************
 * 三色配色共通
 ****************************/

/**
 * row_idの子エレメントとしてカラーセルを生成
 * @param {type} row_id
 * @param {type} taste_id
 * @param {type} index_num 何色目か(1, 2, 3)
 * @param {type} hue_id
 * @param {type} id_suffix
 */
function addTricolorCell(row_id, taste_id, index_num, hue_id, id_suffix) {
		var color_info = getTricolorFuncObj['get' + taste_id + index_num](hue_id);
		var cell_id = taste_id + '_' + hue_id + '_' + index_num;
		
/*		var display_str = true; */
		var display_str = false; 

		var div_text = "";
		var munsell_str = getMunsellString(color_info.hue_id, color_info.v, color_info.c);
		display_str ? div_text = munsell_str : "";   
		cell_id = cell_id + id_suffix;
		addDivTag(row_id,  "tricolor_cell", cell_id, div_text);
		var element = document.getElementById(cell_id);
		element.title = munsell_str;
		element.style.background = color_info.hex;
}

/**
 * 三色配色中のカラーセルを生成する関数群
 * @type Array
 */
getTricolorFuncObj = new Array;

/**
 * CUT1色目 : CUT
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get01cut1 = function(hue_id)
{
	var cut1 = getColorByTasteId(hue_id, '01cut');
	return cut1;
};

/**
 * CUT2色目 : オフホワイト（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get01cut2 = function(hue_id)
{
	var cut2 = new ColorInfo();
	cut2.v = 9;
	cut2.c = 0;
	cut2.hex = '#fffde6';
	cut2.hue_id = 'N';
	return cut2;
};

/**
 * CUT3色目 : 1色目の対照色相・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get01cut3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 13);
	var cut3 = getColorByTasteId(hue_id_3, '01cut');
	return cut3;
};

/**
 * ROM1色目 : ROM
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get02rom1 = function(hue_id)
{
	var rom1 = getColorByTasteId(hue_id, '02rom');
	return rom1;
};

/**
 * ROM2色目 : ホワイト（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get02rom2 = function(hue_id)
{
	var rom2 = new ColorInfo();
	rom2.v = 9;
	rom2.c = 0;
	rom2.hex = '#fff';
	rom2.hue_id = 'N';
	return rom2; 
};

/**
 * ROM3色目 : 1色目の類似色相・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get02rom3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 8);
	var rom3 = getColorByTasteId(hue_id_3, '02rom');
	return rom3;
};

/**
 * NOB1色目 : NOB
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get03nob1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '03nob');
};

/**
 * NOB2色目 : とても明るいグレイ（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get03nob2 = function(hue_id)
{
	var nob2 = new ColorInfo();
	nob2.v = 9;
	nob2.c = 0;
	nob2.hex = '#efefef';
	nob2.hue_id = 'N';
	return nob2;
};

/**
 * NOB2色目 : ホワイト（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get03nob3 = function(hue_id)
{
	var nob3 = new ColorInfo();
	nob3.v = 9;
	nob3.c = 0;
	nob3.hex = '#fff';
	nob3.hue_id = 'N';
	return nob3;
};

/**
 * SMO1色目 : SMO
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get04smo1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '04smo');
};

/**
 * SMO2色目 : とても明るいグレイ（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get04smo2 = function(hue_id)
{
	var smo2 = new ColorInfo();
	smo2.v = 9;
	smo2.c = 0;
	smo2.hex = '#fcfcfc';
	smo2.hue_id = 'N';
	return smo2;
};

/**
 * SMO3色目 : とても明るいグレイ（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get04smo3 = function(hue_id)
{
	var smo3 = new ColorInfo();
	smo3.v = 9;
	smo3.c = 0;
	smo3.hex = '#efefef';
	smo3.hue_id = 'N';
	return smo3;
};

/**
 * CLS1色目 : CLS
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get05cls1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '05cls');
};

/**
 * CLS2色目 : ホワイト（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get05cls2 = function(hue_id)
{
	var cls2 = new ColorInfo();
	cls2.v = 9;
	cls2.c = 0;
	cls2.hex = '#fff';
	cls2.hue_id = 'N';
	return cls2;
};

/**
 * CLS3色目 : 1色目の対照色相・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get05cls3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 12);
	var cls3 = getColorByTasteId(hue_id_3, '05cls');
	return cls3;
};

/**
 * SCA1色目 : SCA
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get06sca1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '06sca');
};

/**
 * SCA2色目 : トライアド・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get06sca2 = function(hue_id)
{
	var hue_id_2 = getFartherColor(hue_id, 26);
	return getColorByTasteId(hue_id_2, '06sca');
};

/**
 * SCA3色目 : トライアド・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get06sca3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 12);
	return getColorByTasteId(hue_id_3, '06sca');
};

/**
 * FEM1色目 : FEM
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get07fem1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '07fem');
};

/**
 * FEM2色目 : 同一色相・ROM
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get07fem2 = function(hue_id)
{
	var fem2 = getColorByTasteId(hue_id, '02rom');
	return fem2;
};

/**
 * FEM3色目 : 中差色相・ROM
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get07fem3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 8);	
	var fem3 = getColorByTasteId(hue_id_3, '02rom');
	return fem3;
};

/**
 * SEL1色目 : SEL
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get08sel1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '08sel');
};

/**
 * SEL2色目 : 明るいグレイ（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get08sel2 = function(hue_id)
{
	var sel2 = new ColorInfo();
	sel2.v = 9;
	sel2.c = 0;
	sel2.hex = '#e8e8e8';
	sel2.hue_id = 'N';
	return sel2;
};

/**
 * SEL3色目 : 明るいグレイ（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get08sel3 = function(hue_id)
{
	var sel3 = new ColorInfo();
	sel3.v = 9;
	sel3.c = 0;
	sel3.hex = '#c4c4c4';
	sel3.hue_id = 'N';
	return sel3;
};

/**
 * ELE1色目 : ELE
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get09ele1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '09ele');
};

/**
 * ELE2色目 : 明るいグレイ（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get09ele2 = function(hue_id)
{
	var ele2 = new ColorInfo();
	ele2.v = 9;
	ele2.c = 0;
	ele2.hex = '#c1c1c1';
	ele2.hue_id = 'N';
	return ele2;
};

/**
 * ELE3色目 : 明るいグレイ（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get09ele3 = function(hue_id)
{
	var ele3 = new ColorInfo();
	ele3.v = 9;
	ele3.c = 0;
	ele3.hex = '#a9a9a9';
	ele3.hue_id = 'N';
	return ele3;
};

/**
 * SPO1色目 : SPO
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get10spo1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '10spo');
};

/**
 * SPO2色目 : ホワイト（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get10spo2 = function(hue_id)
{
	var spo2 = new ColorInfo();
	spo2.v = 9;
	spo2.c = 0;
	spo2.hex = '#fff';
	spo2.hue_id = 'N';
	return spo2;
};

/**
 * SPO3色目 : 対照色相・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get10spo3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 13);	
	var spo3 = getColorByTasteId(hue_id_3, '10spo');
	return spo3;
};

/**
 * CAS1色目 : CAS
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get11cas1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '11cas');
};

/**
 * CAS2色目 : トライアド・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get11cas2 = function(hue_id)
{
	var hue_id_2 = getFartherColor(hue_id, 26);
	return getColorByTasteId(hue_id_2, '11cas');
};

/**
 * CAS3色目 : トライアド・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get11cas3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 12);
	return getColorByTasteId(hue_id_3, '11cas');
};

/**
 * TRA1色目 : TRA
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get12tra1 = function(hue_id)
{
	var tra1 = getColorByTasteId(hue_id, '12tra');
	return tra1;
};

/**
 * TRA2色目 : ブラウン（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get12tra2 = function(hue_id)
{
	var tra2 = new ColorInfo();
	tra2.v = 2;
	tra2.c = 1;
	tra2.hex = '#442000';
	tra2.hue_id = 'Br';
	return tra2;
};

/**
 * TRA3色目 : 対照色相・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get12tra3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 12);
	var tra3 = getColorByTasteId(hue_id_3, '12tra');
	return tra3;
};

/**
 * NAT1色目 : NAT
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get13nat1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '13nat');
};

/**
 * NAT2色目 : 対照色相・ELE-
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get13nat2 = function(hue_id)
{
	var hue_id_2 = getFartherColor(hue_id, 31);
	return getColorByTasteId(hue_id_2, '09ele-');
};

/**
 * NAT2色目 : 2色目と同一色相・1色目と同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get13nat3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 31);
	return getColorByTasteId(hue_id_3, '13nat');
};

/**
 * ELG1色目 : ELG
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get14elg1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '14elg');
};

/**
 * ELG2色目 : 同一色相・HMO
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get14elg2 = function(hue_id)
{
	return getColorByTasteId(hue_id, '21hmo');
};

/**
 * ELG3色目 : 類似色相・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get14elg3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 5);
	return getColorByTasteId(hue_id_3, '14elg');
};

/**
 * DYN1色目 : DYN
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get15dyn1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '15dyn');
};

/**
 * DYN2色目 : ブラック（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get15dyn2 = function(hue_id)
{
	var dyn2 = new ColorInfo();
	dyn2.v = 0;
	dyn2.c = 0;
	dyn2.hex = '#111';
	dyn2.hue_id = 'Bk';
	return dyn2;
};

/**
 * DYN3色目 : 対照色相・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get15dyn3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 14);
	return getColorByTasteId(hue_id_3, '15dyn');
};

/**
 * ETH1色目 : ETH
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get16eth1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '16eth');
};

/**
 * ETH2色目 : ・トライアド・CLA
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get16eth2 = function(hue_id)
{
	var hue_id_2 = getFartherColor(hue_id, 28);
	return getColorByTasteId(hue_id_2, '17cla');
};

/**
 * ETH3色目 : トライアド・DAN
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get16eth3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 14);
	return getColorByTasteId(hue_id_3, '20dan');
};

/**
 * CLA1色目 : CLA
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get17cla1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '17cla');
};

/**
 * CLA2色目 : 中差色相・ELE+
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get17cla2 = function(hue_id)
{
	var hue_id_2 = getFartherColor(hue_id, 10);
	return getColorByTasteId(hue_id_2, '09ele+');
};

/**
 * CLA3色目 : 2色目と同一色相・CLA
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get17cla3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 10);
	return getColorByTasteId(hue_id_3, '17cla');
};

/**
 * GOR1色目 : GOR
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get18gor1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '18gor');
};

/**
 * GOR2色目 : スプリットコンプリメンタリー・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get18gor2 = function(hue_id)
{
	var hue_id_2 = getFartherColor(hue_id, 29);
	return getColorByTasteId(hue_id_2, '18gor');
};

/**
 * GOR3色目 : スプリットコンプリメンタリー・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get18gor3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 5);
	return getColorByTasteId(hue_id_3, '18gor');
};

/**
 * WLD1色目 : WLD
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get19wld1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '19wld');
};

/**
 * WLD2色目 : 隣接補色色相・DAN
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get19wld2 = function(hue_id)
{
	var hue_id_2 = getFartherColor(hue_id, 20);
	return getColorByTasteId(hue_id_2, '20dan');
};

/**
 * WLD3色目 : 2色目と同一色相・1色目と同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get19wld3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 20);
	return getColorByTasteId(hue_id_3, '19wld');
};

/**
 * DAN1色目 : DAN
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get20dan1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '20dan');
};

/**
 * DAN2色目 : トライアド・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get20dan2 = function(hue_id)
{
	var hue_id_2 = getFartherColor(hue_id, 14);
	return getColorByTasteId(hue_id_2, '20dan');
};

/**
 * DAN3色目 : トライアド・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get20dan3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 26);
	return getColorByTasteId(hue_id_3, '20dan');
};

/**
 * HMO1色目 : HMO
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get21hmo1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '21hmo');
};

/**
 * HMO2色目 : 暗いグレイ（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get21hmo2 = function(hue_id)
{
	var hmo2 = new ColorInfo();
	hmo2.v = 0;
	hmo2.c = 0;
	hmo2.hex = '#222';
	hmo2.hue_id = 'N';
	return hmo2;
};

/**
 * HMO3色目 : 対照色相・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get21hmo3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 13);
	return getColorByTasteId(hue_id_3, '21hmo');
};

/**
 * FOR1色目 : FOR
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get22for1 = function(hue_id)
{
	return getColorByTasteId(hue_id, '22for');
};

/**
 * FOR2色目 : 暗いグレイ（全色相共通）
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get22for2 = function(hue_id)
{
	var for2 = new ColorInfo();
	for2.v = 0;
	for2.c = 0;
	for2.hex = '#333';
	for2.hue_id = 'N';
	return for2;
};

/**
 * FOR3色目 : 補色・同一テイスト
 * @param {String} hue_id
 * @returns {ColorInfo}
 */
getTricolorFuncObj.get22for3 = function(hue_id)
{
	var hue_id_3 = getFartherColor(hue_id, 20);
	return getColorByTasteId(hue_id_3, '22for');
};

/****************************
 * ドラッグ＆ドロップ関連（未実装）
 ****************************/

/**
 * ドラッグ開始時の処理
 * @param {type} event
 * @returns {undefined}
 */
function dragstart(event) {

	var new_tag_id = copyDiv(event.target.id);
	event.dataTransfer.setData("text", new_tag_id);

	//ドラッグするデータのid名をDataTransferオブジェクトにセット
  	
  	
  	// event.dataTransfer.setData("text", event.target.id);
}

/**
 * ドラッグ要素がドロップ要素に重なっている間の処理
 * @param {type} event
 * @returns {undefined}
 */
function dragover(event) {
	//dragoverイベントをキャンセルして、ドロップ先の要素がドロップを受け付けるようにする
  	event.preventDefault();
}

/**
 * ドロップ時の処理
 * @param {type} event
 * @returns {undefined}
 */
function drop(event) {
  	//ドラッグされたデータのid名をDataTransferオブジェクトから取得
  	var id_name = event.dataTransfer.getData("text");
  	//id名からドラッグされた要素を取得 -->
  	var drag_elm =document.getElementById(id_name);
  	drag_elm.style.position = "relative";
  	drag_elm.style.left = "0px";
  	drag_elm.style.top = "0px";
  	drag_elm.style.width = "42px";
  	drag_elm.style.height = "42px";
  	drag_elm.style.display = "block";
  	
  	//ドロップ先にドラッグされた要素を追加 -->
  	event.currentTarget.appendChild(drag_elm);
  	
  	drag_elm.draggable = false;
 	//エラー回避のため、ドロップ処理の最後にdropイベントをキャンセルしておく
  	event.preventDefault();
}

/**
 * divを複製
 * @param {type} div_id
 * @returns {String}
 */
function copyDiv(div_id) {
	var element = document.getElementById(div_id);
	var parent_tag = element.parentNode;
	var div_class = element.className;
	var new_id = 'new_' + div_id; 
	addDivTag(parent_tag.id, div_class, new_id, 'new'); 
	var new_elment = document.getElementById(new_id);
	new_elment.style.top = element.style.top + 10;
	new_elment.style.left = element.style.left + 10;
	new_elment.style.background = element.style.background;
	new_elment.style.display = "none";
	return new_id;

}

/****************************
 * クリックイベント関連
 ****************************/

/**
 * ColorGlobeボタンクリック時
 */
function onColorGlobeClicked() {
	swithChartMode('globe');
	removeElement('hvc_str');
}

/**
 * MunsellColorChartボタンクリック時
 */
function onMunsellClicked() {
	swithChartMode('munsell');
	removeElement('hvc_str');
}

/**
 * カラーグローブ/マンセルカラーチャート表示モード切替
 * @param {String} mode 'munsell'または'globe'
 */
function swithChartMode(mode) {
	if (mode === 'munsell') {
		document.getElementById("colorchart").style.display="block";
		document.getElementById("cc_y_axis").style.display="block";
		document.getElementById("cc_x_axis").style.display="block";
		document.getElementById("colorglobe").style.display="none";
		document.getElementById("colorglobe_canvas").style.display="none";
		document.getElementById("cg_y_axis").style.display="none";
		document.getElementById("cg_x_axis").style.display="none";
  	} else if (mode === 'globe') {
		document.getElementById("colorchart").style.display="none";
		document.getElementById("cc_y_axis").style.display="none";
		document.getElementById("cc_x_axis").style.display="none";
		document.getElementById("colorglobe").style.display="block";
		document.getElementById("colorglobe_canvas").style.display="block";
                document.getElementById("cg_y_axis").style.display="block";
		document.getElementById("cg_x_axis").style.display="block";
            } else {
                return null;
            }
        }

/**
 * テイスト別三色配色ドロップダウンリストchange
 * @param {String} taste_id
 */
function onChangeTaste(taste_id) {
	if (taste_id === 'init') {
		removeElement("tricolor_area");
		addDivTag('tricolor_area',  "tricolor_cell", 'tricolor_area_init', '↑ Select TASTE !');
	} else {
		drawTricolor(taste_id);
	}
}

/****************************
 * イベントリスナー関連
 ****************************/

/**
 * イベントリスナー追加
 * @param {Element} elm
 * @param {String} type イベントタイプ
 * @param {function} func 関数
 * @returns {Boolean}
 */
var addListener = function(elm, type, func) {
 	if(! elm) { return false; }
 	/* W3C準拠ブラウザ用 */
 	if(elm.addEventListener) { 
    		elm.addEventListener(type, func, false);
    	/* Internet Explorer用 いるのかいらないのかわかんないわ*/
/*	 } else if(elm.attachEvent) { 
    		elm.attachEvent('on'+type, func); */
  	} else {
    		return false;
  	}
  	return true;
};

/**
 * カラーセルクリック時のイベント追加
 * @param {String} hue_id
 */
function addListenerShowHVCStr(hue_id) {
	var cc_parent_tag = document.getElementById('colorchart');
	if (cc_parent_tag === null) { return null; }
	var cg_parent_tag = document.getElementById('colorglobe');
	if (cg_parent_tag === null) { return null; }
	
	addListenerShowHVCStrChildTags(cc_parent_tag);
	addListenerShowHVCStrChildTags(cg_parent_tag);

}

/**
 * カラーセルクリックで色情報エリアに色情報表示
 * @param {String} parent_tag
 */
function addListenerShowHVCStrChildTags(parent_tag) {
    var child_tags = parent_tag.children;
    for (var i = 0; i < child_tags.length; i++) {
        var child_id = child_tags[i].id;

        addListener(document.getElementById(child_id),
                "click",
                (function(child_id) {
                    return function() {
                        showHVCStr(child_id);
                    };
                })(child_id)
                );
    }
}

/****************************
 * エレメント操作共通
 ****************************/

/**
 * divタグを追加
 * @param {String} parent_id
 * @param {String} child_class
 * @param {String} child_id
 * @param {String} child_text テキストノード
 */
function addDivTag(parent_id, child_class, child_id, child_text) {
	var parent_tag = document.getElementById(parent_id);
	if (parent_tag === null) {
		return;
	}
	var child_tag = document.createElement('div');
	child_tag.id = child_id;
	child_tag.className = child_class;
	child_tag.appendChild(document.createTextNode(child_text));
　 	parent_tag.appendChild(child_tag);
}

/**
 * ツールチップ追加
 * @param {String} tag_id
 * @param {String} tip_text
 */
function addTooltip(tag_id, tip_text) {
	var tag = document.getElementById(tag_id);
	if (tag === null) {
		return;
	}
	tag.title = tip_text;
}

/**
 * 子エレメントを全て削除
 * @param {String} parent_id
 */
function removeElement(parent_id) { 
	var element = document.getElementById(parent_id);
	if (element === null) {
		return;
	}
	while(element.hasChildNodes()){
    		element.removeChild(element.lastChild);
	}
} 

/**
 * parent_idの子エレメントとしてsource_idを持つエレメントをクローン
 * @param {String} parent_id
 * @param {String} source_id
 */
function cloneElement(parent_id, source_id) {
	var source_element = document.getElementById(source_id);
	var parent_element = document.getElementById(parent_id);
	var new_element = source_element.cloneNode(true);
	new_element.id = 'tg_' + new_element.id;
	new_element.style.display = "block"; 
	parent_element.appendChild(new_element);

	new_element = document.getElementById(new_element.id);
	var child_tags = new_element.children;
	for (var i=0; i<child_tags.length; i++) {
		child_tags[i].id =  'tg_' + child_tags[i].id;
		child_tags[i].style.display = "block";
	}
}

/**
 * エレメントに背景色と位置を追加
 * @param {String} cell_id
 * @param {String} color
 * @param {Number} x
 * @param {Number} y
 */
function addColorAndPosiotionToCell(cell_id, color, x, y)  {
	var ch = document.getElementById(cell_id);
	if (ch === null) {
		return;
	}
	ch.style.background = color;

	ch.style.left = x + "px";
	ch.style.top = y + "px";
}

/****************************
 * [Utility] デバッグ関係
 ****************************/

/** 
 * デバッグエリアにstrを表示
 * @param {String} str 表示文字列
 */
function debug(str){
	document.getElementById("debug").innerHTML += "<br/>" + str;
}
/**
 * デバッグエリアをクリア
 */
function debugClear(){
	document.getElementById("debug").innerHTML = "";
}