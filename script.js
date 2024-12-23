document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.querySelector('.upload-container');
    const fileInput = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    const exifInfo = document.getElementById('exifInfo');
    const exifData = document.getElementById('exifData');

    // 处理拖放
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件！');
            return;
        }

        // 显示图片预览
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);

        // 读取EXIF信息
        EXIF.getData(file, function() {
            const exifTags = EXIF.getAllTags(this);
            displayExifData(exifTags);
        });
    }

    function displayExifData(tags) {
        exifData.innerHTML = '';
        exifInfo.classList.remove('hidden');

        if (Object.keys(tags).length === 0) {
            exifData.innerHTML = '<div class="exif-item">没有找到EXIF信息</div>';
            return;
        }

        const relevantTags = {
            'Make': '相机制造商',
            'Model': '相机型号',
            'DateTime': '拍摄时间',
            'ExposureTime': '曝光时间',
            'FNumber': '光圈值',
            'ISOSpeedRatings': 'ISO感光度',
            'FocalLength': '焦距',
            'GPSLatitude': '纬度',
            'GPSLongitude': '经度',
            'ImageWidth': '图片宽度',
            'ImageHeight': '图片高度',
            'Software': '软件',
            'Flash': '闪光灯'
        };

        for (const [key, label] of Object.entries(relevantTags)) {
            if (tags[key] !== undefined) {
                let value = tags[key];
                
                // 特殊处理某些值
                if (key === 'ExposureTime') {
                    value = `${value.numerator}/${value.denominator} 秒`;
                } else if (key === 'FNumber') {
                    value = `f/${value}`;
                } else if (key === 'FocalLength') {
                    value = `${value}mm`;
                }

                const item = document.createElement('div');
                item.className = 'exif-item';
                item.innerHTML = `
                    <div class="exif-label">${label}</div>
                    <div class="exif-value">${value}</div>
                `;
                exifData.appendChild(item);
            }
        }
    }
}); 