import '../css/user.css';
 $('body').height($('body')[0].clientHeight);
 var student = localStorage.getItem("student");
 if(student){
 	student = JSON.parse(student);
 	if(student.perfect){
 		$("#btn").hide();
	 	$("#idcard").val(student.idCardNo);
	 	$("#university").val(student.university);
	 	$("#idcard-img").html('<img src="'+student.idCardPic+'">');
	    $('input').attr('readonly', "readonly")
		$('input').on('focus', function() {
	          $(this).trigger('blur');
	    });
 	}else{
 		$("#btn").show();
 		$("#up").click(function(){
 	       $("#uploaderInput").trigger("click");
        })
		weui.uploader('#uploader', {
				   url: '../center/uploadImg',
				   auto: true,
				   type: 'file',
				   fileVal: 'img',
				   compress: {
				       width: 1600,
				       height: 1600,
				       quality: .8
				   },
				   onBeforeQueued: function(files) {
				       // `this` 是轮询到的文件, `files` 是所有文件
				       if(["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0){
				           weui.alert('请上传图片');
				           return false; // 阻止文件添加
				       }
				       if(this.size > 10* 1024 * 1024){
				           weui.alert('请上传不超过10M的图片');
				           return false;
				       }
				       if (files.length > 1) { // 防止一下子选择过多文件
				           weui.alert('最多只能上传1张图片，请重新选择');
				           return false;
				       }
				        weui.loading("上传中...")
				        return true; // 阻止默认行为，不插入预览图的框架
				   },
				   onQueued: function(){
				        return true; // 阻止默认行为，不显示预览图的图像
				   },
				   onBeforeSend: function(data, headers){
				   },
				   onProgress: function(procent){
				   },
				   onSuccess: function (ret) {
				       weui.loading("上传中...").hide();
				       if(ret.success){
				       	  var idcardImg = ret.data.url;
				       	  $("#idcard-img").html('<img src="'+student.idcardImg+'">');
				       	  weui.alert(ret.desc);
				       }else{
				       	  $("#idcard-img").html("");
				       	  weui.alert(ret.desc);
				       }
		
				   },
				   onError: function(err){
				       weui.loading("上传中...").hide();
				       weui.alert("上传失败");
				   }
		});
		$("#btn").click(function(){
	        var idcard = $("#idcard").val().trim();
	        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	        if(!reg.test(idcard)){
	        	return weui.alert("身份证未填写或格式不正确");
	        }
	        var idcardImg = $("#idcard-img>img").attr("src");
	        if(!idcardImg){
	        	return weui.alert("身份证未上传");
	        }
	        var university = $("#university").val().trim();
	        if(!university){
	        	return weui.alert("学校名称未填写");
	        }
			student = JSON.parse(student);
			weui.loading("提交中..");
	        $.ajax({
	        	type:"post",
	        	url:"../center/updateInformation",
	        	data:{
	        		studentId:student.studentId,
	        		idCardNo:idcard,
	        		idCardPic:idcardImg,
	        		university:university
	        	},
	        	success:function(r){
	        		if(r.success){
	        			student.idCardNo = idcard;
	        			student.idCardPic = idcardImg;
						student.university = university;
						student.perfect = true;
						localStorage.setItem("student", JSON.stringify(student));
						location.href = 'userInfo-suc.html';
	        		}else{
	        			weui.loading("提交中..").hide();
	        			weui.alert(r.desc);
	        		}
	        	}
	        });
		})
    }
}
