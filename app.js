document.addEventListener("DOMContentLoaded", () => {
	// DOM要素
	const dropArea = document.getElementById("dropArea");
	const dropMessage = document.getElementById("dropMessage");
	const uploadedImage = document.getElementById("uploadedImage");
	const magnifier = document.getElementById("magnifier");
	const currentColor = document.getElementById("currentColor");
	const previousColor = document.getElementById("previousColor");
	const hexValue = document.getElementById("hexValue");
	const rValue = document.getElementById("rValue");
	const gValue = document.getElementById("gValue");
	const bValue = document.getElementById("bValue");
	const rgbValue = document.getElementById("rgbValue");
	const hslValue = document.getElementById("hslValue");
	const rSlider = document.getElementById("rSlider");
	const gSlider = document.getElementById("gSlider");
	const bSlider = document.getElementById("bSlider");
	const paletteContainer = document.getElementById("paletteContainer");
	const colorHistoryContainer = document.getElementById("colorHistory");
	const imageHistoryContainer = document.getElementById("imageHistory");
	const clearImageBtn = document.getElementById("clearImageBtn");
	const clearHistoryBtn = document.getElementById("clearHistoryBtn");
	const notification = document.getElementById("notification");
	const notificationText = document.getElementById("notificationText");

	// カラーピッカー要素
	const colorPicker = document.getElementById("colorPicker");
	const currentColorPreview = document.getElementById("currentColor");

	// HSL要素
	const hValue = document.getElementById("hValue");
	const sValue = document.getElementById("sValue");
	const lValue = document.getElementById("lValue");
	const hSlider = document.getElementById("hSlider");
	const sSlider = document.getElementById("sSlider");
	const lSlider = document.getElementById("lSlider");

	// HSV要素
	const hvValue = document.getElementById("hvValue");
	const svValue = document.getElementById("svValue");
	const vValue = document.getElementById("vValue");
	const hvSlider = document.getElementById("hvSlider");
	const svSlider = document.getElementById("svSlider");
	const vSlider = document.getElementById("vSlider");
	const hsvValue = document.getElementById("hsvValue");

	// 変数
	let currentImageUrl = null;
	let imageHistoryData = [];
	let colorHistoryData = [];
	let isManualColorChange = false;

	// 初期化
	loadHistory();
	initializeColorValues("#000000");

	// イベントリスナー
	dropArea.addEventListener("dragover", handleDragOver);
	dropArea.addEventListener("dragleave", handleDragLeave);
	dropArea.addEventListener("drop", handleDrop);
	dropArea.addEventListener("click", triggerFileInput);
	document.addEventListener("paste", handlePaste);
	uploadedImage.addEventListener("mousemove", handleImageMouseMove);
	uploadedImage.addEventListener("click", handleImageClick);

	// マウスが画像から離れたときの処理
	uploadedImage.addEventListener("mouseleave", () => {
		const magnifier = document.getElementById("magnifier");
		magnifier.style.display = "none";
	});

	// 現在の色のプレビューをクリックしたらカラーピッカーを開く
	currentColorPreview.addEventListener("click", () => {
		// カラーピッカーの現在の値を設定
		colorPicker.value = hexValue.value;
		// カラーピッカーをクリック
		colorPicker.click();
	});

	// カラーピッカーの値が変更されたときの処理
	colorPicker.addEventListener("input", () => {
		// 選択された色を取得
		const selectedColor = colorPicker.value;

		// 色を更新
		isManualColorChange = true;
		updateColorValues(selectedColor);
	});

	// カラー値の入力イベント
	hexValue.addEventListener("input", () => {
		isManualColorChange = true;
		handleHexInput();
	});
	rValue.addEventListener("input", () => {
		isManualColorChange = true;
		handleRGBInput();
	});
	gValue.addEventListener("input", () => {
		isManualColorChange = true;
		handleRGBInput();
	});
	bValue.addEventListener("input", () => {
		isManualColorChange = true;
		handleRGBInput();
	});
	rSlider.addEventListener("input", () => {
		isManualColorChange = true;
		handleSliderInput();
	});
	gSlider.addEventListener("input", () => {
		isManualColorChange = true;
		handleSliderInput();
	});
	bSlider.addEventListener("input", () => {
		isManualColorChange = true;
		handleSliderInput();
	});

	// HSL入力のイベントリスナー
	hValue.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSLInput();
	});
	sValue.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSLInput();
	});
	lValue.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSLInput();
	});
	hSlider.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSLSliderInput();
	});
	sSlider.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSLSliderInput();
	});
	lSlider.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSLSliderInput();
	});

	// HSV入力のイベントリスナー
	hvValue.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSVInput();
	});
	svValue.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSVInput();
	});
	vValue.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSVInput();
	});
	hvSlider.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSVSliderInput();
	});
	svSlider.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSVSliderInput();
	});
	vSlider.addEventListener("input", () => {
		isManualColorChange = true;
		handleHSVSliderInput();
	});

	// ボタンイベント
	clearImageBtn.addEventListener("click", clearImage);
	clearHistoryBtn.addEventListener("click", clearHistory);

	// コピーボタンのイベント設定
	for (const btn of document.querySelectorAll(".copy-btn")) {
		btn.addEventListener("click", handleCopy);
	}

	// マグニファイアの初期設定
	magnifier.style.display = "none";
	document.body.appendChild(magnifier);

	// ドラッグ&ドロップ関連の関数
	function handleDragOver(e) {
		e.preventDefault();
		if (!dropArea.classList.contains("disabled")) {
			dropArea.classList.add("active");
		}
	}

	function handleDragLeave(e) {
		e.preventDefault();
		dropArea.classList.remove("active");
	}

	function handleDrop(e) {
		e.preventDefault();
		dropArea.classList.remove("active");

		if (
			!dropArea.classList.contains("disabled") &&
			e.dataTransfer.files &&
			e.dataTransfer.files[0]
		) {
			processFile(e.dataTransfer.files[0]);
		}
	}

	function triggerFileInput() {
		if (
			!dropArea.classList.contains("disabled") &&
			uploadedImage.classList.contains("hidden")
		) {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = "image/*";
			input.onchange = (e) => {
				if (e.target.files?.[0]) {
					processFile(e.target.files[0]);
				}
			};
			input.click();
		}
	}

	function handlePaste(e) {
		if (!dropArea.classList.contains("disabled")) {
			const items = (e.clipboardData || e.originalEvent.clipboardData).items;
			for (const item of items) {
				if (item.type.indexOf("image") === 0) {
					const blob = item.getAsFile();
					processFile(blob);
					break;
				}
			}
		}
	}

	function processFile(file) {
		if (!file || !file.type.match(/image.*/)) {
			showNotification("画像ファイルを選択してください。", "error");
			return;
		}
		// ファイルサイズをチェック
		const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
		const isLargeFile = file.size > 4 * 1024 * 1024; // 4MB

		if (isLargeFile) {
			// 大きいファイルの場合は警告を表示（処理は続行）
			showNotification(
				`ファイルサイズが大きいため（${fileSizeMB}MB）、履歴には保存されません。`,
				"info",
			);
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			// 画像のロード完了を待つ
			// 画像読み込み完了時にイベントリスナーを追加
			uploadedImage.onload = () => {
				// 画像表示
				uploadedImage.classList.remove("hidden");
				dropMessage.classList.add("hidden");

				// 表示する
				const clearImageBtn = document.getElementById("clearImageBtn");
				if (clearImageBtn) {
					clearImageBtn.classList.remove("hidden");
				} else {
					console.error("clearImageBtn not found in DOM");
				}

				// 画像がある状態のクラスを追加
				dropArea.classList.add("has-image");
				dropArea.classList.add("picker-mode");

				// 画像に直接イベントリスナーを設定
				uploadedImage.style.cursor = "crosshair"; // 画像自体のカーソルも十字に

				// カラーパレットを生成
				generateColorPalette(uploadedImage);
			};

			// 画像のソースを設定
			uploadedImage.src = e.target.result;
			currentImageUrl = e.target.result;

			// 4MB未満の場合のみ履歴に追加
			if (!isLargeFile) {
				addToHistory(e.target.result);
			}
		};
		reader.readAsDataURL(file);
	}

	function handleImageMouseMove(e) {
		if (uploadedImage.classList.contains("hidden")) return;

		const rect = uploadedImage.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// 画像の実際のサイズとDOM上のサイズの比率を計算
		const scaleX = uploadedImage.naturalWidth / rect.width;
		const scaleY = uploadedImage.naturalHeight / rect.height;

		// 実際の画像上の座標を計算
		const actualX = Math.floor(x * scaleX);
		const actualY = Math.floor(y * scaleY);

		// マグニファイアの位置を設定
		const magnifier = document.getElementById("magnifier");
		magnifier.style.display = "block";
		magnifier.style.left = `${e.clientX + 20}px`;
		magnifier.style.top = `${e.clientY + 20}px`;

		// マグニファイアの拡大部分を設定
		const zoomFactor = 10; // 拡大率
		const zoomElement = magnifier.querySelector(".magnifier-zoom");
		zoomElement.style.backgroundImage = `url(${uploadedImage.src})`;
		zoomElement.style.backgroundSize = `${uploadedImage.naturalWidth * zoomFactor}px ${uploadedImage.naturalHeight * zoomFactor}px`;
		zoomElement.style.backgroundPosition = `-${actualX * zoomFactor - 60}px -${actualY * zoomFactor - 60}px`;

		// カラーを取得して表示
		getColorAtPosition(actualX, actualY, (color) => {
			if (color) {
				const hexCode = rgbToHex(color.r, color.g, color.b);
				const rgbText = `RGB(${color.r}, ${color.g}, ${color.b})`;

				// カラープレビューを設定
				const colorPreview = magnifier.querySelector(
					".magnifier-color-preview",
				);
				colorPreview.style.backgroundColor = hexCode;

				// カラーコードを設定
				const hexElement = magnifier.querySelector(".magnifier-hex");
				hexElement.textContent = hexCode;

				const rgbElement = magnifier.querySelector(".magnifier-rgb");
				rgbElement.textContent = rgbText;

				const currentColorBlock = document.getElementById("currentColor");
				if (currentColorBlock) {
					currentColorBlock.style.backgroundColor = hexCode;
				}
			}
		});
	}

	function handleImageClick(e) {
		console.log("Image clicked"); // デバッグ用

		if (uploadedImage.classList.contains("hidden")) {
			console.log("Image is hidden, can't pick color");
			return;
		}

		const rect = uploadedImage.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// 画像の実際のサイズとDOM上のサイズの比率を計算
		const scaleX = uploadedImage.naturalWidth / rect.width;
		const scaleY = uploadedImage.naturalHeight / rect.height;

		// 実際の画像上の座標を計算
		const actualX = Math.floor(x * scaleX);
		const actualY = Math.floor(y * scaleY);

		console.log("Actual coordinates:", actualX, actualY); // デバッグ用

		// カラーを取得して設定
		getColorAtPosition(actualX, actualY, (color) => {
			if (color) {
				console.log("Picked color:", color); // デバッグ用
				const hexCode = rgbToHex(color.r, color.g, color.b);
				isManualColorChange = false;
				updateColorValues(hexCode);

				// カラー履歴に追加
				addToColorHistory(hexCode);
			}
		});
	}

	function getColorAtPosition(x, y, callback) {
		try {
			// オフスクリーンキャンバスを作成
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			// 画像サイズをキャンバスに設定
			canvas.width = uploadedImage.naturalWidth;
			canvas.height = uploadedImage.naturalHeight;

			// 画像をキャンバスに描画
			ctx.drawImage(uploadedImage, 0, 0);

			try {
				// ピクセルデータを取得
				const imageData = ctx.getImageData(x, y, 1, 1);
				const data = imageData.data;

				callback({
					r: data[0],
					g: data[1],
					b: data[2],
				});
			} catch (e) {
				console.error("Error getting pixel data:", e);

				// CORS問題の可能性がある場合、代替アプローチを試みる
				const img = new Image();
				img.crossOrigin = "Anonymous";
				img.onload = () => {
					canvas.width = img.width;
					canvas.height = img.height;
					ctx.drawImage(img, 0, 0);

					try {
						const imageData = ctx.getImageData(x, y, 1, 1);
						const data = imageData.data;

						callback({
							r: data[0],
							g: data[1],
							b: data[2],
						});
					} catch (e2) {
						console.error("Second attempt failed:", e2);
						callback(null);
					}
				};
				img.src = uploadedImage.src;
			}
		} catch (error) {
			console.error("Error in getColorAtPosition:", error);
			callback(null);
		}
	}

	// カラー値関連の関数
	function initializeColorValues(hex) {
		updateColorValues(hex, false);
	}

	function updateColorValues(hex, updatePrevious = true) {
		if (updatePrevious && !isManualColorChange) {
			const prevHex = hexValue.value;
			previousColor.style.backgroundColor = prevHex;
		}

		// HEX値を設定
		hexValue.value = hex;
		currentColor.style.backgroundColor = hex;

		// RGB値を設定
		const rgb = hexToRgb(hex);
		rValue.value = rgb.r;
		gValue.value = rgb.g;
		bValue.value = rgb.b;
		rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

		// スライダーを設定
		rSlider.value = rgb.r;
		gSlider.value = rgb.g;
		bSlider.value = rgb.b;

		// HSL値を設定
		const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
		hValue.value = Math.round(hsl.h);
		sValue.value = Math.round(hsl.s);
		lValue.value = Math.round(hsl.l);
		hSlider.value = Math.round(hsl.h);
		sSlider.value = Math.round(hsl.s);
		lSlider.value = Math.round(hsl.l);
		hslValue.value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;

		// HSV値を設定
		const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
		hvValue.value = Math.round(hsv.h);
		svValue.value = Math.round(hsv.s);
		vValue.value = Math.round(hsv.v);
		hvSlider.value = Math.round(hsv.h);
		svSlider.value = Math.round(hsv.s);
		vSlider.value = Math.round(hsv.v);
		hsvValue.value = `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`;

		// スライダーの色を更新
		updateSliderColors(rgb, hsl, hsv);

		// 手動変更フラグをリセット
		isManualColorChange = false;
	}

	function handleHexInput() {
		let hex = hexValue.value;

		// #が含まれていない場合は追加
		if (hex.charAt(0) !== "#") {
			hex = `#${hex}`;
		}

		// 6桁のHEXコードになるように調整
		if (hex.length > 7) {
			hex = hex.slice(0, 7);
		}

		// 有効なHEXコードかチェック
		if (/^#[0-9A-F]{6}$/i.test(hex)) {
			updateColorValues(hex);
		}
	}

	function handleRGBInput() {
		const r = clamp(Number.parseInt(rValue.value) || 0, 0, 255);
		const g = clamp(Number.parseInt(gValue.value) || 0, 0, 255);
		const b = clamp(Number.parseInt(bValue.value) || 0, 0, 255);

		rValue.value = r;
		gValue.value = g;
		bValue.value = b;

		const hex = rgbToHex(r, g, b);
		updateColorValues(hex);
	}

	function handleSliderInput() {
		const r = Number.parseInt(rSlider.value);
		const g = Number.parseInt(gSlider.value);
		const b = Number.parseInt(bSlider.value);

		rValue.value = r;
		gValue.value = g;
		bValue.value = b;

		const hex = rgbToHex(r, g, b);
		updateColorValues(hex);
	}

	// HSL入力ハンドラー
	function handleHSLInput() {
		const h = clamp(Number.parseInt(hValue.value) || 0, 0, 360);
		const s = clamp(Number.parseInt(sValue.value) || 0, 0, 100);
		const l = clamp(Number.parseInt(lValue.value) || 0, 0, 100);

		hValue.value = h;
		sValue.value = s;
		lValue.value = l;

		const rgb = hslToRgb(h, s, l);
		const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
		updateColorValues(hex);
	}

	function handleHSLSliderInput() {
		const h = Number.parseInt(hSlider.value);
		const s = Number.parseInt(sSlider.value);
		const l = Number.parseInt(lSlider.value);

		hValue.value = h;
		sValue.value = s;
		lValue.value = l;

		const rgb = hslToRgb(h, s, l);
		const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
		updateColorValues(hex);
	}

	// HSV入力ハンドラー
	function handleHSVInput() {
		const h = clamp(Number.parseInt(hvValue.value) || 0, 0, 360);
		const s = clamp(Number.parseInt(svValue.value) || 0, 0, 100);
		const v = clamp(Number.parseInt(vValue.value) || 0, 0, 100);

		hvValue.value = h;
		svValue.value = s;
		vValue.value = v;

		const rgb = hsvToRgb(h, s, v);
		const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
		updateColorValues(hex);
	}

	function handleHSVSliderInput() {
		const h = Number.parseInt(hvSlider.value);
		const s = Number.parseInt(svSlider.value);
		const v = Number.parseInt(vSlider.value);

		hvValue.value = h;
		svValue.value = s;
		vValue.value = v;

		const rgb = hsvToRgb(h, s, v);
		const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
		updateColorValues(hex);
	}

	// スライダーの色を更新する関数
	function updateSliderColors(rgb, hsl, hsv) {
		// RGB スライダーの色更新
		rSlider.style.background = `linear-gradient(to right, rgb(0, ${rgb.g}, ${rgb.b}), rgb(255, ${rgb.g}, ${rgb.b}))`;
		rSlider.style.backgroundSize = "calc(100% - 18px) 100%";
		rSlider.style.backgroundPosition = "9px center";
		rSlider.style.backgroundRepeat = "no-repeat";

		gSlider.style.background = `linear-gradient(to right, rgb(${rgb.r}, 0, ${rgb.b}), rgb(${rgb.r}, 255, ${rgb.b}))`;
		gSlider.style.backgroundSize = "calc(100% - 18px) 100%";
		gSlider.style.backgroundPosition = "9px center";
		gSlider.style.backgroundRepeat = "no-repeat";

		bSlider.style.background = `linear-gradient(to right, rgb(${rgb.r}, ${rgb.g}, 0), rgb(${rgb.r}, ${rgb.g}, 255))`;
		bSlider.style.backgroundSize = "calc(100% - 18px) 100%";
		bSlider.style.backgroundPosition = "9px center";
		bSlider.style.backgroundRepeat = "no-repeat";

		// HSL スライダーの色更新
		sSlider.style.background = `linear-gradient(to right, hsl(${hsl.h}, 0%, 50%), hsl(${hsl.h}, 100%, 50%))`;
		sSlider.style.backgroundSize = "calc(100% - 18px) 100%";
		sSlider.style.backgroundPosition = "9px center";
		sSlider.style.backgroundRepeat = "no-repeat";

		lSlider.style.background = `linear-gradient(to right, hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))`;
		lSlider.style.backgroundSize = "calc(100% - 18px) 100%";
		lSlider.style.backgroundPosition = "9px center";
		lSlider.style.backgroundRepeat = "no-repeat";

		// HSV スライダーの色更新
		svSlider.style.background = `linear-gradient(to right, hsl(${hsv.h}, 0%, 100%), hsl(${hsv.h}, 100%, 50%))`;
		svSlider.style.backgroundSize = "calc(100% - 18px) 100%";
		svSlider.style.backgroundPosition = "9px center";
		svSlider.style.backgroundRepeat = "no-repeat";

		vSlider.style.background = `linear-gradient(to right, hsl(${hsv.h}, ${hsv.s}%, 0%), hsl(${hsv.h}, ${hsv.s}%, 50%))`;
		vSlider.style.backgroundSize = "calc(100% - 18px) 100%";
		vSlider.style.backgroundPosition = "9px center";
		vSlider.style.backgroundRepeat = "no-repeat";
	}

	// カラー履歴関連の関数
	function addToColorHistory(hexCode) {
		// 既に同じ色があれば削除
		colorHistoryData = colorHistoryData.filter((color) => color !== hexCode);

		// 先頭に追加
		colorHistoryData.unshift(hexCode);

		// 最大20件に制限
		if (colorHistoryData.length > 20) {
			colorHistoryData = colorHistoryData.slice(0, 20);
		}

		// 履歴表示を更新
		updateColorHistoryDisplay();
	}

	function updateColorHistoryDisplay() {
		colorHistoryContainer.innerHTML = "";

		for (const hexCode of colorHistoryData) {
			const colorItem = document.createElement("div");
			colorItem.className = "color-history-item";
			colorItem.style.backgroundColor = hexCode;
			colorItem.title = hexCode;

			colorItem.addEventListener("click", () => {
				isManualColorChange = false;
				updateColorValues(hexCode);
			});

			colorHistoryContainer.appendChild(colorItem);
		}
	}

	// カラーパレット生成
	function generateColorPalette(image) {
		// 既存のパレットをクリア
		paletteContainer.innerHTML = "";

		// 画像からカラーパレットを生成
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = image.naturalWidth;
		canvas.height = image.naturalHeight;
		ctx.drawImage(image, 0, 0);

		// 画像データを取得
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

		// カラーを収集
		const colorMap = {};
		const sampleStep = Math.max(1, Math.floor(imageData.length / 4 / 10000)); // サンプリングステップ

		for (let i = 0; i < imageData.length; i += 4 * sampleStep) {
			const r = imageData[i];
			const g = imageData[i + 1];
			const b = imageData[i + 2];

			// 色を量子化して似た色をグループ化
			const quantizedR = Math.round(r / 16) * 16;
			const quantizedG = Math.round(g / 16) * 16;
			const quantizedB = Math.round(b / 16) * 16;

			const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;

			if (!colorMap[colorKey]) {
				colorMap[colorKey] = {
					r: quantizedR,
					g: quantizedG,
					b: quantizedB,
					count: 0,
				};
			}

			colorMap[colorKey].count++;
		}

		// Colorクラスを使って色リストを作成
		class Color {
			constructor(r, g, b, count) {
				this.r = r;
				this.g = g;
				this.b = b;
				this.count = count;
				const hsl = rgbToHsl(r, g, b);
				this.h = hsl.h;
				this.s = hsl.s;
				this.l = hsl.l;
			}
			getHex() {
				return rgbToHex(this.r, this.g, this.b);
			}
			toString() {
				return `[${this.getHex()}][RGB(${this.r}, ${this.g}, ${this.b})][HSL(${Math.round(this.h)}, ${Math.round(this.s)}%, ${Math.round(this.l)}%)]`;
			}
		}
		// 色リスト作成
		const colorList = Object.values(colorMap).map(
			(c) => new Color(c.r, c.g, c.b, c.count),
		);

		// 頻度順で上位20色を抽出
		const topColors = colorList.sort((a, b) => b.count - a.count).slice(0, 20);

		// 色相・彩度・明度でソートし、最大10色だけ表示
		const sortedColors = topColors
			.sort((a, b) => {
				if (a.h !== b.h) return a.h - b.h;
				if (a.s !== b.s) return a.s - b.s;
				return a.l - b.l;
			})
			.slice(0, 10);

		for (const color of sortedColors) {
			const colorElement = document.createElement("div");
			colorElement.className = "palette-color";
			colorElement.style.backgroundColor = color.getHex();
			colorElement.title = color.toString();
			colorElement.addEventListener("click", () => {
				const hex = color.getHex();
				isManualColorChange = false;
				updateColorValues(hex);
				addToColorHistory(hex);
			});
			paletteContainer.appendChild(colorElement);
		}
	}

	// 履歴関連の関数
	function addToHistory(imageUrl) {
		// 既に同じ画像があれば削除
		imageHistoryData = imageHistoryData.filter((item) => item !== imageUrl);

		// 先頭に追加
		imageHistoryData.unshift(imageUrl);

		// 最大10件に制限
		if (imageHistoryData.length > 10) {
			imageHistoryData = imageHistoryData.slice(0, 10);
		}

		// LocalStorageに保存
		localStorage.setItem("imageHistory", JSON.stringify(imageHistoryData));

		// 履歴表示を更新
		updateHistoryDisplay();
	}

	function loadHistory() {
		const savedHistory = localStorage.getItem("imageHistory");
		if (savedHistory) {
			try {
				imageHistoryData = JSON.parse(savedHistory);
				updateHistoryDisplay();
			} catch (e) {
				console.error("履歴の読み込みに失敗しました:", e);
				imageHistoryData = [];
			}
		}
	}

	function updateHistoryDisplay() {
		imageHistoryContainer.innerHTML = "";

		for (const url of imageHistoryData) {
			const historyItem = document.createElement("div");
			historyItem.className = "history-item";

			const img = document.createElement("img");
			img.src = url;
			img.alt = "History image";

			historyItem.appendChild(img);
			historyItem.addEventListener("click", () => {
				uploadedImage.src = url;
				uploadedImage.classList.remove("hidden");
				dropMessage.classList.add("hidden");
				currentImageUrl = url;

				// 画像入力ブロックを無効化
				// dropArea.classList.add("disabled");
				// 画像がある状態のクラスを追加
				document.getElementById("clearImageBtn").classList.remove("hidden");
				dropArea.classList.add("has-image");
				dropArea.classList.add("picker-mode");

				// カラーパレットを生成
				generateColorPalette(uploadedImage);
			});

			imageHistoryContainer.appendChild(historyItem);
		}
	}

	function clearHistory() {
		imageHistoryData = [];
		localStorage.removeItem("imageHistory");
		updateHistoryDisplay();
		showNotification("履歴をクリアしました");
	}

	function clearImage() {
		document.getElementById("clearImageBtn").classList.add("hidden");
		uploadedImage.classList.add("hidden");
		dropMessage.classList.remove("hidden");
		currentImageUrl = null;
		magnifier.style.display = "none";
		paletteContainer.innerHTML = "";

		// 画像入力ブロックを有効化
		dropArea.classList.remove("disabled");
		// has-imageクラスを削除
		dropArea.classList.remove("has-image");
		dropArea.classList.remove("picker-mode");
	}

	// コピー機能
	function handleCopy(e) {
		const type = e.currentTarget.getAttribute("data-copy");
		let textToCopy = "";

		switch (type) {
			case "hex-with-hash":
				textToCopy = hexValue.value;
				break;
			case "hex-without-hash":
				textToCopy = hexValue.value.replace("#", "");
				break;
			case "r-value":
				textToCopy = rValue.value;
				break;
			case "g-value":
				textToCopy = gValue.value;
				break;
			case "b-value":
				textToCopy = bValue.value;
				break;
			case "rgb-value":
				textToCopy = rgbValue.value;
				break;
			case "hsl-value":
				textToCopy = hslValue.value;
				break;
			case "h-value":
				textToCopy = hValue.value;
				break;
			case "s-value":
				textToCopy = sValue.value;
				break;
			case "l-value":
				textToCopy = lValue.value;
				break;
			case "hv-value":
				textToCopy = hvValue.value;
				break;
			case "sv-value":
				textToCopy = svValue.value;
				break;
			case "v-value":
				textToCopy = vValue.value;
				break;
			case "hsv-value":
				textToCopy = hsvValue.value;
				break;
		}

		if (textToCopy) {
			navigator.clipboard
				.writeText(textToCopy)
				.then(() => {
					showNotification(`コピーしました: ${textToCopy}`);
				})
				.catch((err) => {
					console.error("コピーに失敗しました:", err);
					showNotification("コピーに失敗しました");
				});
		}
	}

	// ユーティリティ関数
	function hexToRgb(hex) {
		// #を削除
		hex = hex.replace("#", "");

		// 3桁のHEXコードを6桁に変換
		if (hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}

		const r = Number.parseInt(hex.substring(0, 2), 16);
		const g = Number.parseInt(hex.substring(2, 4), 16);
		const b = Number.parseInt(hex.substring(4, 6), 16);

		return { r, g, b };
	}

	function rgbToHex(r, g, b) {
		return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
	}

	function componentToHex(c) {
		const hex = c.toString(16);
		return hex.length === 1 ? `0${hex}` : hex;
	}

	function rgbToHsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h;
		let s;
		const l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // achromatic
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}

			h /= 6;
		}

		return {
			h: h * 360,
			s: s * 100,
			l: l * 100,
		};
	}

	// HSLからRGBへの変換
	function hslToRgb(h, s, l) {
		h /= 360;
		s /= 100;
		l /= 100;

		const a = s * Math.min(l, 1 - l);
		const f = (n) => {
			const k = (n + h * 12) % 12;
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
			return Math.round(255 * color);
		};

		return { r: f(0), g: f(8), b: f(4) };
	}

	// RGBからHSVへの変換
	function rgbToHsv(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const d = max - min;

		let h;
		let s;
		const v = max;

		if (d === 0) {
			h = s = 0;
		} else {
			s = d / max;

			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}

			h *= 60;
		}

		return {
			h: h,
			s: s * 100,
			v: v * 100,
		};
	}

	// HSVからRGBへの変換
	function hsvToRgb(h, s, v) {
		h = h % 360;
		s = s / 100;
		v = v / 100;

		const c = v * s;
		const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
		const m = v - c;

		let r;
		let g;
		let b;

		if (h < 60) {
			r = c;
			g = x;
			b = 0;
		} else if (h < 120) {
			r = x;
			g = c;
			b = 0;
		} else if (h < 180) {
			r = 0;
			g = c;
			b = x;
		} else if (h < 240) {
			r = 0;
			g = x;
			b = c;
		} else if (h < 300) {
			r = x;
			g = 0;
			b = c;
		} else {
			r = c;
			g = 0;
			b = x;
		}

		return {
			r: Math.round((r + m) * 255),
			g: Math.round((g + m) * 255),
			b: Math.round((b + m) * 255),
		};
	}

	// HSVからHSLへの変換
	function hsvToHsl(h, s, v) {
		s /= 100;
		v /= 100;

		const l = v * (1 - s / 2);
		const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

		return {
			h: h,
			s: sl * 100,
			l: l * 100,
		};
	}

	// HSLからHSVへの変換
	function hslToHsv(h, s, l) {
		s /= 100;
		l /= 100;

		const v = l + s * Math.min(l, 1 - l);
		const sv = v === 0 ? 0 : 2 * (1 - l / v);

		return {
			h: h,
			s: sv * 100,
			v: v * 100,
		};
	}

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	/**
	 * 通知を表示する関数
	 * @param {string} message - 表示するメッセージ
	 * @param {string} type - 通知の種類（'success', 'error', 'info'など）
	 */
	function showNotification(message, type = "success") {
		notificationText.textContent = message;
		notification.className = "notification"; // クラスをリセット

		// 通知タイプに応じたクラスを追加
		if (type === "error") {
			notification.classList.add("error");
		} else if (type === "info") {
			notification.classList.add("info");
		} else {
			notification.classList.add("success");
		}

		notification.classList.remove("hidden");

		// 通知タイプに応じて表示時間を変える
		const duration = type === "error" || type === "info" ? 4000 : 2000;

		setTimeout(() => {
			notification.classList.add("hidden");
		}, duration);
	}

	/**
	 * ファイルサイズをチェックする関数
	 * @param {File} file - チェックするファイル
	 * @param {number} maxSizeMB - 最大許容サイズ（MB）
	 * @returns {boolean} - サイズが許容範囲内ならtrue、そうでなければfalse
	 */
	function checkFileSize(file, maxSizeMB) {
		const maxSizeBytes = maxSizeMB * 1024 * 1024; // MBをバイトに変換

		if (file.size > maxSizeBytes) {
			const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
			showNotification(
				`ファイルサイズが大きすぎます（${fileSizeMB}MB）。${maxSizeMB}MB以下の画像を選択してください。`,
				"error",
			);
			return false;
		}

		return true;
	}
});
