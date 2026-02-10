function showSection(sectionId, btn) {
    // Update Sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    // Update Nav Buttons
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
}

function openModal(title, body) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function showDayDetails(day, points, breakdownStr) {
    if (!breakdownStr) {
        openModal(`${day}`, "<p style='opacity:0.7; margin-top:10px;'>No points recorded for this day.</p>");
        return;
    }
    
    const items = breakdownStr.split(',').map(item => {
        const [label, score] = item.split(':');
        return `<li style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
            <span>${label.trim()}</span>
            <span style="color:#ff9966; font-weight:bold;">+${score.trim()}</span>
        </li>`;
    }).join('');
    
    const html = `<ul style="list-style:none; padding:0; margin-top:5px; text-align:left; font-size:14px;">${items}</ul>`;
    openModal(`${day} • ${points} pts`, html);
}

/* Admin Functions */
function checkPin() {
    const pin = document.getElementById('pin-input').value;
    if(pin === "TARA123") {
        document.getElementById('admin-lock').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        document.getElementById('pin-input').value = ''; // Clear pin
        document.getElementById('pin-error').style.display = 'none';
    } else {
        document.getElementById('pin-error').style.display = 'block';
    }
}

function lockAdmin() {
    document.getElementById('admin-lock').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
}

function updateTotalScore() {
    const newScore = document.getElementById('total-score-input').value;
    if(newScore) {
        // Updates the Points number in the Stats section (2nd stat-box)
        document.querySelectorAll('.stat-box h3')[1].innerText = newScore;
        document.getElementById('total-score-input').value = '';
        alert("Total Score Updated!");
    }
}

function updateDayStats() {
    const dayIndex = document.getElementById('day-select').value;
    const points = document.getElementById('day-points').value;
    const reason = document.getElementById('day-reason').value;
    
    if(points && reason) {
        const bars = document.querySelectorAll('.chart-container .bar');
        const bar = bars[dayIndex];
        const dayName = bar.querySelector('span').innerText;
        
        // Update visual height (capped at 25000 for scale)
        const heightPercentage = Math.min((points / 25000) * 100, 100);
        bar.style.height = heightPercentage + '%';
        bar.setAttribute('data-value', points);
        
        // Update click details
        const safeReason = reason.replace(/'/g, "\\'");
        bar.setAttribute('onclick', `showDayDetails('${dayName}', '${points}', '${safeReason}')`);
        
        // Clear inputs
        document.getElementById('day-points').value = '';
        document.getElementById('day-reason').value = '';
        
        alert(`${dayName} Updated Successfully!`);
    } else {
        alert("Please enter both points and a breakdown reason.");
    }
}

/* Gallery Functions */
document.addEventListener("DOMContentLoaded", () => {
    renderGallery();
    renderAdminGallery();
});

function uploadPhoto() {
    const input = document.getElementById('gallery-upload');
    if(input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const src = e.target.result;
            let gallery = JSON.parse(localStorage.getItem('tara_gallery')) || [];
            gallery.push(src);
            localStorage.setItem('tara_gallery', JSON.stringify(gallery));
            
            renderGallery();
            renderAdminGallery();
            alert('Photo added to gallery!');
            input.value = '';
        }
        reader.readAsDataURL(input.files[0]);
    } else {
        alert("Please select a photo first.");
    }
}

function renderGallery() {
    const container = document.getElementById('gallery-grid');
    if(!container) return;
    const gallery = JSON.parse(localStorage.getItem('tara_gallery')) || [];
    container.innerHTML = gallery.map(img => `<img src="${img}" class="gallery-item" onclick="openModal('Photo', '<img src=\\'${img}\\' style=\\'width:100%;border-radius:10px;\\'>')">`).join('');
}

function renderAdminGallery() {
    const container = document.getElementById('admin-gallery-list');
    if(!container) return;
    const gallery = JSON.parse(localStorage.getItem('tara_gallery')) || [];
    container.innerHTML = gallery.map((img, index) => `
        <div style="position:relative; width:60px; height:60px;">
            <img src="${img}" style="width:100%; height:100%; object-fit:cover; border-radius:8px; border:1px solid rgba(255,255,255,0.2);">
            <button onclick="deletePhoto(${index})" style="position:absolute; top:-5px; right:-5px; background:#ff5e62; color:white; border:none; border-radius:50%; width:20px; height:20px; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center;">&times;</button>
        </div>
    `).join('');
}

function deletePhoto(index) {
    if(!confirm("Delete this photo?")) return;
    let gallery = JSON.parse(localStorage.getItem('tara_gallery')) || [];
    gallery.splice(index, 1);
    localStorage.setItem('tara_gallery', JSON.stringify(gallery));
    renderGallery();
    renderAdminGallery();
}