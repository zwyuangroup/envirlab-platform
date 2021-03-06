var InsightMakerFileExtension = "";

// Append file extension to file (if not already there)
function appendFileExtension(filename,extension) {
	var extension_position=filename.length-extension.length;
	var current_extension=filename.slice(extension_position);
	if(current_extension.toLowerCase()!=extension.toLowerCase()) {
		filename+=extension;
	}
	return filename;
}

// Set the title to include the model name
function setTitle(filename) {
	var title;
	if(filename) {
		title = filename+" | 环境虚拟仿真实验平台";
		
	} else {
		title = "环境虚拟仿真实验平台";
	}
	window.parent.document.title = title;
}

// Get xml data for the current model
function getModelXML2() {
	var enc = new mxCodec();
	var graph_dom=enc.encode(graph.getModel());
	var xml_data="<InsightMakerModel>"+graph_dom.innerHTML+"</InsightMakerModel>";
	return xml_data;
}

// Makes a new model
function newModel() {
	clearModel();
}

// High-level File manager. Does save and load of models
var FileManagerWeb = new function() {
	var self = this;
	var filename = null;
	
	this.set_filename = function(filename) {
		self.filename=filename;
		setTitle(filename);
	}
	
	this.saveModel = function() {
		Ext.MessageBox.prompt('模型名称', '输入模型名称', function(btn, model_name){
			if(btn=='cancel') {
				return;
			}
			if (btn == 'ok'){
				var xml_data = getModelXML2();
				model_name=appendFileExtension(model_name,InsightMakerFileExtension);
				self.set_filename(model_name);
				downloadFile(model_name,xml_data);
			}
		});

	};
	
	this.loadModel = function() {
		openFile({
			read: "text",
			multiple: false,
			accept: InsightMakerFileExtension,
			onCompleted: function(model) {
				importMXGraph(model.contents);
				self.set_filename(model.name);
			}
		});
	};
	
	this.newModel = function() {
		self.set_filename(null);
		newModel();
	}
};

// FileMenu for environment.WebOffline
var FileMenuWeb = {
text: getText('文件'),
itemId: "filegroup",
glyph: 0xf15b,
menu: [
	{
		glyph: 0xf016,
		text: getText('新建'),
		tooltip: getText('新建模型'),
		handler: FileManagerWeb.newModel,
		scope: this
	}, 
	{
		glyph: 0xf115, /*0xf115 alternative icon we could have used */
		text: getText('加载'),
		tooltip: getText('加载模型'),
		handler: FileManagerWeb.loadModel,
		scope: this
	}, 
	{
		glyph: 0xf0c7,
		text: getText('保存'),
		tooltip: getText('保存模型'),
		handler: FileManagerWeb.saveModel,
		scope: this
	}
]
};

// Get the correct FileMenu depending on the environment
var FileMenu;
switch(viewConfig.environment) {
	case environment.InsightMakerOnline:
		FileMenu = [];
		break;
	case environment.WebOffline:
		FileMenu = [];
		break;
}
