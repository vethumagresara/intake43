/* personal.js
   Collects Intake 43 Day Scholar details and generates a professional PDF
*/

const { jsPDF } = window.jspdf;

document.getElementById('personalForm').addEventListener('submit', function(e){
  e.preventDefault();
  const photoInput = document.getElementById('photo');
  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = evt => generatePDF(evt.target.result);
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    generatePDF(null);
  }
});

function collectFormData() {
  const form=document.getElementById('personalForm');
  const fd=new FormData(form);
  const getAll = n => fd.getAll(n);
  const get = n => fd.get(n)||'';

  return {
    dayscholarNo:get('dayscholarNo'),
    nameInitials:get('nameInitials'),
    fullName:get('fullName'),
    academicStream:get('academicStream'),
    gender:get('gender'),
    email:get('email'),
    contact:get('contact'),
    dob:get('dob'),
    nationality:get('nationality'),
    religion:get('religion'),

    height:get('height'),
    weight:get('weight'),
    chest:get('chest'),
    neck:get('neck'),
    bloodGroup:get('bloodGroup'),
    waist:get('waist'),
    bootSize:get('bootSize'),

    nic:get('nic'),
    policeStation:get('policeStation'),
    bank:get('bank'),
    accountNo:get('accountNo'),

    schools:getAll('school[]'),
    ol:{
      buddhism:get('ol_buddhism'), sinhala:get('ol_sinhala'),
      english:get('ol_english'), maths:get('ol_maths'),
      science:get('ol_science'), history:get('ol_history'),
      basket1:[get('ol_basket1_sub'), get('ol_basket1_res')],
      basket2:[get('ol_basket2_sub'), get('ol_basket2_res')],
      basket3:[get('ol_basket3_sub'), get('ol_basket3_res')]
    },
    alSubs:getAll('al_sub[]'),
    alRes:getAll('al_res[]'),
    alEnglish:get('al_english'),
    alGK:get('al_gk'),

    sports:getAll('sport[]').map((s,i)=>[s, getAll('sportLevel[]')[i]]),
    activities:getAll('activityType[]').map((a,i)=>[a, getAll('activityPosition[]')[i]]),
    languages:form.querySelectorAll('input[name="language"]:checked') ? 
              Array.from(form.querySelectorAll('input[name="language"]:checked')).map(c=>c.value):[],

    relations:getAll('relation[]'),
    father:{name:get('fatherName'), nic:get('fatherNic'), occ:get('fatherOcc'), addr:get('fatherAddress'), contact:get('fatherContact')},
    mother:{name:get('motherName'), nic:get('motherNic'), occ:get('motherOcc'), addr:get('motherAddress'), contact:get('motherContact')},
    siblings:getAll('sibName[]').map((n,i)=>[n,getAll('sibAge[]')[i],getAll('sibOcc[]')[i],getAll('sibStatus[]')[i]])
  };
}

function generatePDF(photoData) {
  const d = collectFormData();
  const doc = new jsPDF({unit:'pt', format:'a4'});
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  let y = 50;
  const leftMargin = 40;
  const rightMargin = 40;
  const contentWidth = pageWidth - leftMargin - rightMargin;

  // Header with border - Fixed spacing
  function addHeader() {
    // Add decorative border
    doc.setDrawColor(20, 90, 160);
    doc.setLineWidth(2);
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40, 'S');
    
    doc.setLineWidth(1);
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60, 'S');

    // Main title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 90, 160);
    const titleText = 'PERSONAL DETAIL FORM';
    const titleWidth = doc.getTextWidth(titleText);
    doc.text(titleText, (pageWidth - titleWidth) / 2, 60);
    
    // Subtitle
    doc.setFontSize(12);
    const subtitleText = 'INTAKE 43 DAY SCHOLARS';
    const subtitleWidth = doc.getTextWidth(subtitleText);
    doc.text(subtitleText, (pageWidth - subtitleWidth) / 2, 80);
    
    // Decorative line
    doc.setDrawColor(20, 90, 160);
    doc.setLineWidth(1);
    doc.line(leftMargin, 90, pageWidth - rightMargin, 90);
    
    y = 110;
  }

  // Photo and basic info header - Fixed overlapping
  function addPhotoAndBasicInfo() {
    const photoX = leftMargin;
    const photoY = y;
    const photoWidth = 100;
    const photoHeight = 130;
    
    // Photo frame
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(1);
    doc.rect(photoX, photoY, photoWidth, photoHeight, 'S');
    
    if (photoData) {
      try {
        doc.addImage(photoData, 'JPEG', photoX + 3, photoY + 3, photoWidth - 6, photoHeight - 6);
      } catch (e) {
        // If photo fails, add placeholder text
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Photo', photoX + photoWidth/2 - 15, photoY + photoHeight/2);
      }
    } else {
      // Placeholder for photo
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('PHOTO', photoX + photoWidth/2 - 18, photoY + photoHeight/2);
    }

    // Basic info next to photo
    const infoX = photoX + photoWidth + 20;
    let infoY = photoY;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    // Dayscholar Number
    doc.setFont('helvetica', 'bold');
    doc.text('Dayscholar No:', infoX, infoY + 20);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 90, 160);
    doc.text(d.dayscholarNo || 'N/A', infoX + 90, infoY + 20);
    
    // Name with Initials
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Name with Initials:', infoX, infoY + 40);
    doc.setFont('helvetica', 'normal');
    doc.text(d.nameInitials || 'N/A', infoX, infoY + 55);
    
    // Full Name
    doc.setFont('helvetica', 'bold');
    doc.text('Full Name:', infoX, infoY + 75);
    doc.setFont('helvetica', 'normal');
    doc.text(d.fullName || 'N/A', infoX, infoY + 90);
    
    // Academic Stream
    doc.setFont('helvetica', 'bold');
    doc.text('Academic Stream:', infoX, infoY + 110);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 90, 160);
    doc.text(d.academicStream || 'N/A', infoX + 110, infoY + 110);
    
    y = photoY + photoHeight + 30;
  }

  // Section heading with consistent styling
  function addSectionHeading(title, sectionNumber) {
    if (y > pageHeight - 100) {
      doc.addPage();
      y = 50;
    }
    
    // Section background
    doc.setFillColor(245, 248, 255);
    doc.rect(leftMargin, y - 8, contentWidth, 20, 'F');
    
    // Section border
    doc.setDrawColor(20, 90, 160);
    doc.setLineWidth(1);
    doc.rect(leftMargin, y - 8, contentWidth, 20, 'S');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 90, 160);
    doc.text(`${sectionNumber}. ${title}`, leftMargin + 8, y + 7);
    
    doc.setTextColor(0, 0, 0);
    y += 25;
  }

  // Enhanced table function with consistent styling
  function addStyledTable(data, tableName = '', options = {}) {
    // Skip empty tables
    if (!data || data.length === 0) return;
    
    if (y > pageHeight - 150) {
      doc.addPage();
      y = 50;
    }

    // Add table name if provided
    if (tableName) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(tableName, leftMargin, y);
      y += 18;
    }

    const tableOptions = {
      startY: y,
      theme: 'striped',
      head: options.head || [['Field', 'Information']],
      body: data,
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      },
      headStyles: {
        fillColor: [20, 90, 160],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [250, 252, 255]
      },
      columnStyles: {
        0: { 
          cellWidth: 120, 
          fontStyle: 'bold',
          textColor: [60, 60, 60]
        },
        1: { 
          cellWidth: contentWidth - 120
        }
      },
      margin: { left: leftMargin, right: rightMargin },
      ...options
    };

    doc.autoTable(tableOptions);
    y = doc.lastAutoTable.finalY + 15;
  }

  // Generate PDF content
  addHeader();
  addPhotoAndBasicInfo();

  // Section 1: Personal Information
  addSectionHeading('PERSONAL INFORMATION', 'I');
  const personalData = [
    ['Gender', d.gender],
    ['Email Address', d.email],
    ['Contact Number', d.contact],
    ['Date of Birth', d.dob],
    ['Nationality', d.nationality],
    ['Religion', d.religion]
  ].filter(row => row[1] && row[1].trim() !== '');
  
  if (personalData.length > 0) {
    addStyledTable(personalData, 'Basic Details');
  }

  // Section 2: Physical Measurements
  addSectionHeading('PHYSICAL MEASUREMENTS', 'II');
  const physicalData = [
    ['Height', d.height ? `${d.height} cm` : ''],
    ['Weight', d.weight ? `${d.weight} kg` : ''],
    ['Chest', d.chest ? `${d.chest} cm` : ''],
    ['Neck', d.neck ? `${d.neck} cm` : ''],
    ['Waist', d.waist ? `${d.waist} cm` : ''],
    ['Blood Group', d.bloodGroup],
    ['Boot Size', d.bootSize]
  ].filter(row => row[1] && row[1].trim() !== '');
  
  if (physicalData.length > 0) {
    addStyledTable(physicalData, 'Body Measurements');
  }

  // Section 3: Identity & Banking
  addSectionHeading('IDENTITY & BANKING DETAILS', 'III');
  const identityData = [
    ['National Identity Card', d.nic],
    ['Police Station', d.policeStation],
    ['Bank', d.bank],
    ['Account Number', d.accountNo]
  ].filter(row => row[1] && row[1].trim() !== '');
  
  if (identityData.length > 0) {
    addStyledTable(identityData, 'Official Documents');
  }

  // Section 4: Educational Background
  addSectionHeading('EDUCATIONAL BACKGROUND', 'IV');
  
  // Schools
  if (d.schools && d.schools.length > 0) {
    const schoolData = d.schools
      .map((school, i) => [`School ${i + 1}`, school])
      .filter(row => row[1] && row[1].trim() !== '');
    
    if (schoolData.length > 0) {
      addStyledTable(schoolData, 'Schools Attended');
    }
  }

  // O/L Results
  const olData = [
    ['Buddhism', d.ol.buddhism],
    ['Sinhala', d.ol.sinhala],
    ['English', d.ol.english],
    ['Mathematics', d.ol.maths],
    ['Science', d.ol.science],
    ['History', d.ol.history]
  ].filter(row => row[1] && row[1].trim() !== '');

  if (d.ol.basket1[0] && d.ol.basket1[0].trim() !== '') {
    olData.push(['Basket Subject 1', `${d.ol.basket1[0]} - ${d.ol.basket1[1] || 'N/A'}`]);
  }
  if (d.ol.basket2[0] && d.ol.basket2[0].trim() !== '') {
    olData.push(['Basket Subject 2', `${d.ol.basket2[0]} - ${d.ol.basket2[1] || 'N/A'}`]);
  }
  if (d.ol.basket3[0] && d.ol.basket3[0].trim() !== '') {
    olData.push(['Basket Subject 3', `${d.ol.basket3[0]} - ${d.ol.basket3[1] || 'N/A'}`]);
  }

  if (olData.length > 0) {
    addStyledTable(olData, 'Ordinary Level (O/L) Results', { 
      head: [['Subject', 'Grade']] 
    });
  }

  // A/L Results
  if (d.alSubs && d.alSubs.length > 0) {
    const alData = d.alSubs
      .map((sub, i) => [`A/L Subject ${i + 1}`, `${sub} - ${d.alRes[i] || 'N/A'}`])
      .filter(row => row[1] && !row[1].includes(' - N/A') && row[1].trim() !== ' - ');
    
    if (d.alEnglish && d.alEnglish.trim() !== '') {
      alData.push(['A/L English', d.alEnglish]);
    }
    if (d.alGK && d.alGK.trim() !== '') {
      alData.push(['General Knowledge', d.alGK]);
    }
    
    if (alData.length > 0) {
      addStyledTable(alData, 'Advanced Level (A/L) Results', { 
        head: [['Subject', 'Grade']] 
      });
    }
  }

  // Section 5: Sports & Activities
  addSectionHeading('SPORTS & EXTRA-CURRICULAR ACTIVITIES', 'V');
  
  // Sports
  if (d.sports && d.sports.length > 0) {
    const sportsData = d.sports
      .map((sport, i) => [`Sport ${i + 1}`, `${sport[0]} - ${sport[1] || 'N/A'}`])
      .filter(row => row[1] && row[1] !== ' - N/A' && row[1].trim() !== ' - ');
    
    if (sportsData.length > 0) {
      addStyledTable(sportsData, 'Sports Achievements', { 
        head: [['Sport', 'Level/Achievement']] 
      });
    }
  }

  // Activities
  if (d.activities && d.activities.length > 0) {
    const activityData = d.activities
      .map((activity, i) => [`Activity ${i + 1}`, `${activity[0]} - ${activity[1] || 'N/A'}`])
      .filter(row => row[1] && row[1] !== ' - N/A' && row[1].trim() !== ' - ');
    
    if (activityData.length > 0) {
      addStyledTable(activityData, 'Extra-Curricular Activities', { 
        head: [['Activity', 'Position/Role']] 
      });
    }
  }

  // Languages
  if (d.languages && d.languages.length > 0) {
    const languageData = [['Language Proficiency', d.languages.join(', ')]];
    addStyledTable(languageData, 'Language Skills');
  }

  // Section 6: Family Information
  addSectionHeading('FAMILY INFORMATION', 'VI');
  
  // Father's Information
  if (d.father.name && d.father.name.trim() !== '') {
    const fatherData = [
      ['Name', d.father.name],
      ['NIC', d.father.nic],
      ['Occupation', d.father.occ],
      ['Address', d.father.addr],
      ['Contact', d.father.contact]
    ].filter(row => row[1] && row[1].trim() !== '');
    
    if (fatherData.length > 0) {
      addStyledTable(fatherData, "Father's Information");
    }
  }

  // Mother's Information
  if (d.mother.name && d.mother.name.trim() !== '') {
    const motherData = [
      ['Name', d.mother.name],
      ['NIC', d.mother.nic],
      ['Occupation', d.mother.occ],
      ['Address', d.mother.addr],
      ['Contact', d.mother.contact]
    ].filter(row => row[1] && row[1].trim() !== '');
    
    if (motherData.length > 0) {
      addStyledTable(motherData, "Mother's Information");
    }
  }

  // Siblings
  if (d.siblings && d.siblings.length > 0) {
    const siblingData = d.siblings
      .map((sib, i) => [
        `Sibling ${i + 1}`, 
        `Name: ${sib[0]}, Age: ${sib[1]}, Occupation: ${sib[2]}, Status: ${sib[3]}`
      ])
      .filter(row => row[1] && row[1] !== 'Name: , Age: , Occupation: , Status: ');
    
    if (siblingData.length > 0) {
      addStyledTable(siblingData, 'Siblings Information');
    }
  }

  // Relations in Forces
  if (d.relations && d.relations.length > 0) {
    const relationData = d.relations
      .map((rel, i) => [`Relation ${i + 1}`, rel])
      .filter(row => row[1] && row[1].trim() !== '');
    
    if (relationData.length > 0) {
      addStyledTable(relationData, 'Relations in Tri-Forces/Police', { 
        head: [['Relationship', 'Details']] 
      });
    }
  }

  // Declaration
  if (y > pageHeight - 120) {
    doc.addPage();
    y = 50;
  }
  
  y += 20;
  doc.setDrawColor(20, 90, 160);
  doc.setLineWidth(1);
  doc.line(leftMargin, y, pageWidth - rightMargin, y);
  
  y += 25;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 90, 160);
  doc.text('DECLARATION', leftMargin, y);
  
  y += 20;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('I hereby certify that all the information provided above is true and accurate to the best of my knowledge.', leftMargin, y);
  
  y += 40;
  doc.text('Date: ___________________', leftMargin, y);
  doc.text('Signature: ___________________', pageWidth - rightMargin - 200, y);

  // Save with formatted filename
  const fname = (d.fullName || 'personal_details').replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
  doc.save(`${fname}_intake43_dayscholar.pdf`);
}