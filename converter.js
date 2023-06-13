// 새로운 HTML 생성 후 열기
var seq_n='';
// function openNewHTML(newHTML) {

//     // 새로운 HTML을 다운로드할 파일 이름을 지정합니다.
//     var fileName = "new_html_page.html";
  
//     // HTML 파일을 다운로드하기 위해 Blob 객체를 생성합니다.
//     var blob = new Blob([newHTML], { type: "text/html" });
  
//     // Blob 객체의 URL을 생성합니다.
//     var url = URL.createObjectURL(blob);
  
//     // 생성한 URL로 새 창을 엽니다.
//     window.open(url, "_blank");
  
//     // URL 생성 후, 더 이상 사용하지 않을 때 URL을 해제합니다.
//     URL.revokeObjectURL(url);
//   }

function find_exon(){

    var seq_name = $("#seq_name").val();
    return $.ajax({
        url: "exon_finder.php",
        method: "POST",
        data: { seq_name: seq_name},
        success: function(data) {
            // 변환된 RNA를 표시
            console.log("success");
            console.log(data);
            exxon = data;
            var splitArray = exxon.split('>');
            const updatedlist = []
            for(var a in splitArray){
                const temp = a.split("\t");
                updatedlist.push(temp);
            }
            return exxon;
        },
        error: function(xhr) {
            console.log(xhr.statusText);
            return 'error';
          }
    });

}
function positionBox(a, index, length,g_seq,p_seq,indxes) {
    //segment_index,start_index_mod100,seq_len_t-temp_seq_len,g_seq,p_seq,exon name
    console.log(a, index, length);
    
    var referenceWidth = 10;
    var siRNA_len = length;
    var siRNABox = document.createElement("div");
    siRNABox.className = "siRNA-box";
    siRNABox.style.left = (referenceWidth*index)+"px";
    siRNABox.style.width = (referenceWidth*length) + "px";
    siRNABox.style.display="block";
    // var exxon = find_exon(indxes);
    // console.log(exxon);
    
    var siRNAInfo = document.createElement("div");
    siRNAInfo.className = "siRNA-info";
    siRNAInfo.innerHTML = 'guide sequence : ' +g_seq + '\npassenger sequence : ' + p_seq+',Features\n'+'Interaction with HRMT1L2.\n {ECO:0000269|PubMed:15186775}';
    siRNABox.appendChild(siRNAInfo);
    
    return siRNABox;

}
    
$(document).ready(function() {
    
   // 'find_sequence' 버튼 클릭 이벤트 처리
    $("#find_mRNA").click(function() {
        find_exon();
        var seq_name = $("#seq_name").val();
        //AJAX 요청
        $.ajax({
            url: "mRNA_finder.php",
            method: "POST",
            data: { seq_name: seq_name },
            success: function(data) {
                
                // 변환된 RNA를 표시
                console.log("success");
                
                $("#mRNA_seq").val(data);
                seq_n = seq_name;
            },
            error: function(xhr) {
                console.log(xhr.statusText);
              }
        });
    });
//find_siRNA 버튼 클릭 이벤트 처리
    $("#submit").click(function() {

        // var splitArray = exxon.split('>');
        // const updatedlist = []
        // for(var a in splitArray){
        //     const temp = a.split("\t");
        //     updatedlist.push(temp);
        // }
        // console.log(exxon);
        var exxon = '';
        find_exon()
        .done(function(data) {
            var exxon = data; // AJAX 요청 완료 후 변수 업데이트
        })
        .fail(function(xhr, status, error) {
            // 에러 처리
            var exxon = "";
            console.error(error);
        });
        console.log(exxon);

        var par1 = p1;
        var par2 = p1_7;
        var par3 = p19;
        var par4 = GCcontents;
        var par5 = rule;
        var par6 = siRNAlen;
        var param = par1 + ' ' + par2 + ' '+par3+' '+par4+' '+par5+' '+par6
        // 사용자가 입력한 DNA
        var seq = $("#mRNA_seq").val();
        var mRNA_se = seq.replace(/^>.*/gm, "").replace(/\n/g, "");
        mRNA_seq = mRNA_se + ' ' + param
        var data = {mRNA_seq:mRNA_seq, mRNA_name:seq_n}
        // AJAX 요청
        
        $.ajax({
            url: "siRNA_finder.php",
            method: "POST",
            
            dataType: "json",
            // success: function(data) {
            //     // 변환된 RNA를 표시
            //     console.log(data)
            //     $("#mRNA_seq").val(data);
            // }
            data: { mRNA_seq: mRNA_seq },
            success: function(data) {
                console.log(data)
                var table = `
                <!DOCTYPE html>
                <html>    
                <head>
                <style>
                    body {
                    font-family: 'Roboto', sans-serif;
                    background-color: #ffffff;
                    color: #000000;
                    }
                    .sequence-segment {
                        font-family: monospace;
                        font-size: 20px;
                        white-space: pre;
                        margin-bottom:10px;
                        

                    }
            
                    .siRNA-box {
                        display: none;
                        width: 10px;
                        height: 20px;
                        border: 1px solid black;
                        position: relative;
                        margin-bottom: 5px;
                    }
            
                    .siRNA-info {
                        display: none;
                        position: absolute;
                        font-size : 5px;
                        top: 25px;
                        left: 0;
                        padding: 5px;
                        background-color: #f9f9f9;
                        border: 1px solid #ddd;
                        z-index: 1;
                    }
            
                    .siRNA-box:hover .siRNA-info {
                        display: block;
                    }
                   
                  
                </style>
                </head>
                <body>
                `; 
                table += '<h2> siRNA Candidates</h2>'
                table += '<table>';
                var num = 1;
                
                table += '<thead><tr><th>Position</th><th>Target sequence</th><th>Guide siRNA / Passenger siRNA</th><th>Rule</th><th>Score</th></tr></thead><tbody>';
                var siRNA_lst = [] //segment_index(start_index//100), start_index(data[key][0].split(' - ')[0]), length(par6)
                // 만약 100 - start_index % 100 < seq_len 이라면 두칸 쓰니까
                //segment_index, segment_index + 1
                for(var key in data){
                table += '<tr>';
                table += '<td>' + data[key][0] + '</td>';
                table += '<td>' + data[key][1] + '</td>';
                table += '<td>' + data[key][2] + '</td>';
                table += '<td>' + data[key][3] + '</td>';
                table += '<td>' + data[key][4] + '</td>';
                table += '</tr>';
                var start_index = data[key][0].split(" - ")[0]
                var segment_index = Math.floor(start_index/100);
                var start_index_mod100 = start_index%100;
                var g_seq = data[key][2].split('\n')[0];
                var p_seq = data[key][2].split('\n')[1];
                var indexes = data[key][0]
                var seq_len_t = parseInt(par6);
                if (100-start_index_mod100<seq_len_t){
                  var temp_seq_len = start_index_mod100+seq_len_t-100;
                  siRNA_lst.push([segment_index,start_index_mod100,seq_len_t-temp_seq_len,g_seq,p_seq,indexes]);
        
                  siRNA_lst.push([segment_index+1,0,temp_seq_len,g_seq,p_seq,indexes]);
        
                }else{
                siRNA_lst.push([segment_index,start_index_mod100,seq_len_t,g_seq,p_seq,indexes]);}
                
                
                }
                
                table += '</tbody></table>';
                table += '<br><br>';
                
                table += '<h2> siRNA Positions</h2>';

                table += generateSequenceHTML(mRNA_se,siRNA_lst);
                table+= `</body>
                </html>
              `; 
              console.log(siRNA_lst);

                $('#table-container').html(table);
              },
              error: function(xhr) {
                console.log(xhr.statusText);
                console.log('error');
              }
        });
    });
});
