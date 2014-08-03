function addForm(_args){
	
	var addTableData = [];
	var weatherTableData = [];
	var startDateField;
	var cityLabel;
    var tempLabel;
    var tempTextLabel;
    var humidityLabel;
    var pressureLabel;
    var fontFamilyVar = 'Source Sans Pro';
    var fontSizeVar ='16';
    var tabbar = _args.tabbar;
	var userid = Ti.App.Properties.getString('userid');
	var domain = Ti.App.Properties.getString('domain');
	
	var self = Ti.UI.createWindow(ef.combine($$.tabWindow,{
		titleControl:Ti.UI.createLabel({
			text:'Migraine',
			color:'#FFF',
			font:{
				fontSize:18,
				fontFamily:fontFamilyVar
			}
		}),
		fullscreen:false,
		navBarHidden:false,
		backgroundColor:'#d7d6d5'
	}));
	
	var mainContainerView = Ti.UI.createScrollView({
	  	width:Ti.UI.FILL,
	  	height:Ti.UI.FILL,
	  	top:0,
	  	layout:'vertical',
	  	contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: true,
  		showHorizontalScrollIndicator: false
	});

	self.add(mainContainerView);
	
	var saveButton = Titanium.UI.createButton({
		title:'Save',
		color:'#FFF',
		backgroundImage: 'none',
		font:{
			fontSize:18,
			fontFamily:fontFamilyVar
		}
	});
	
	self.setRightNavButton(saveButton);
	
	saveButton.addEventListener('click', function(e) {
		
		var saveURL = "http://"+domain+"/model/mobile/services/migraines.cfc?method=addMigraine";
		var saveData = {
		    userid: userid,
		    startdatetime: startDateField.value,
		    enddatetime: endDateField.value,
		    severity: 1,
		    locationid: 1,
		    triggerid:1,
		    w_city: cityField.value,
			w_condition: conditionField.value,
			w_temperature: tempField.value,
			w_humidity: humidityField.value,
			w_pressure: pressureField.value
		};

		var xhr = Ti.Network.createHTTPClient({
			enableKeepAlive:false,
	    	onload: function() {
				var json = JSON.parse(this.responseText);
				var migraine = json.MIGRAINEINFO[0];
				var	migraineid = migraine.ID;
				
				addTableData = [];
				weatherTableData = [];
				populateAddTable();
				//startDateTimePickerView.animate(slideUp);
				
				if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE){
					var alertDialog = Ti.UI.createAlertDialog({
						title:'WARNING!',
						message:'Your device is not online.',
						buttonNames:['OK']
					});
					alertDialog.show();
				}
				else{
					loadWeatherData();
				}	
	    	},
	    	onerror: function(e) {
	    		alert("STATUS: " + this.status);
		    	alert("TEXT:   " + this.responseText);
		    	alert("ERROR:  " + e.error);
	    	},
	    	timeout:999999
	    });
	    //xhr.setRequestHeader("ContentType", "image/jpeg");
		//xhr.setRequestHeader("enctype","multipart/form-data");
	    xhr.open("GET", saveURL);
		xhr.send(saveData);
		
	});
	
	var slideLoadingDown = Ti.UI.createAnimation({
		top:0,
		duration:200
	});
	
	var slideLoadingUp = Ti.UI.createAnimation({
		top:-54,
		duration:200
	});
	
	var loadingView = Ti.UI.createView({
	  	backgroundColor:'#00BFFF',
	  	width:Ti.UI.FILL,
	  	height:54,
	  	top:-54,
	  	zIndex:3
	});
	
	var bottomBorderView = Ti.UI.createView({
	  	backgroundColor:'#CCC',
	  	width:Ti.UI.FILL,
	  	height:1,
	  	bottom:0
	});
	
	var loadingActivityIndicator = Ti.UI.createActivityIndicator({
		style:Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		color:'#FFF',
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,
		message:'Loading your weather data...',
		font:{
			fontSize:fontSizeVar,
			fontFamily:fontFamilyVar
		}
	});
	
	loadingActivityIndicator.show();
	
	loadingView.add(loadingActivityIndicator);
	loadingView.add(bottomBorderView);
	
	self.add(loadingView);
	
	var startDateTimePickerView = Titanium.UI.createView({
		width:Ti.UI.FILL,
		height:251,
		bottom:-251,
		layout:'vertical',
		zIndex:2
	});
	
	var startDateTimePicker = Ti.UI.createPicker({
		selectionIndicator : true,
		type: Ti.UI.PICKER_TYPE_DATE_AND_TIME,
		bottom:0
	});
	
	var slideUp =  Titanium.UI.createAnimation({bottom:0,duration:300});
	var slideDown =  Titanium.UI.createAnimation({bottom:-251,duration:300});
	
	var space = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var done = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.DONE,
		width:20
	});
	
	done.addEventListener('click', function() {
		startDateTimePickerView.animate(slideDown);
	});
	
	var startDateTimeToolbar = Ti.UI.iOS.createToolbar({
		items:[space,done],
		width:Ti.UI.FILL,
		height:43,
		backgroundColor:'#bbb'
	});
	
	startDateTimePickerView.add(startDateTimeToolbar);
	startDateTimePickerView.add(startDateTimePicker);
	
	self.add(startDateTimePickerView);
	
	startDateTimePicker.addEventListener('change', function(e) {
		var pickerdatetime = e.value;
	    var day = parseInt(pickerdatetime.getDate());
	    var month = parseInt(pickerdatetime.getMonth())+1;
	    var year = pickerdatetime.getFullYear();
	    var hours = parseInt(pickerdatetime.getHours());
        var minutes = parseInt(pickerdatetime.getMinutes());
        var AMPM = ((pickerdatetime.getHours()>12)?('PM'):'AM');
        if(hours > 12){
        	hours = hours-12;
        }
        if(hours < 10){
        	hours = '0' + hours;
        }
        if(minutes < 10){
        	minutes = '0' + minutes;
        }
	    var newdate = month + "/" + day + "/" + year + ' ' + hours + ':' + minutes + ' ' + AMPM;
	    
		startDateField.value = newdate;
	});
	
	var endDateTimePickerView = Titanium.UI.createView({
		width:Ti.UI.FILL,
		height:251,
		bottom:-251,
		layout:'vertical',
		zIndex:2
	});
	
	var endDateTimePicker = Ti.UI.createPicker({
		selectionIndicator : true,
		type: Ti.UI.PICKER_TYPE_DATE_AND_TIME,
		bottom:0
	});
	
	var slideUp =  Titanium.UI.createAnimation({bottom:0,duration:300});
	var slideDown =  Titanium.UI.createAnimation({bottom:-251,duration:300});
	
	var space = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var endDone = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.DONE,
		width:20
	});
	
	endDone.addEventListener('click', function() {
		endDateTimePickerView.animate(slideDown);
	});
	
	var endDateTimeToolbar = Ti.UI.iOS.createToolbar({
		items:[space,endDone],
		width:Ti.UI.FILL,
		height:43,
		backgroundColor:'#bbb'
	});
	
	endDateTimePickerView.add(endDateTimeToolbar);
	endDateTimePickerView.add(endDateTimePicker);
	
	self.add(endDateTimePickerView);
	
	endDateTimePicker.addEventListener('change', function(e) {
		var pickerdatetime = e.value;
	    var day = parseInt(pickerdatetime.getDate());
	    var month = parseInt(pickerdatetime.getMonth())+1;
	    var year = pickerdatetime.getFullYear();
	    var hours = parseInt(pickerdatetime.getHours());
        var minutes = parseInt(pickerdatetime.getMinutes());
        var AMPM = ((pickerdatetime.getHours()>12)?('PM'):'AM');
        if(hours > 12){
        	hours = hours-12;
        }
        if(hours < 10){
        	hours = '0' + hours;
        }
        if(minutes < 10){
        	minutes = '0' + minutes;
        }
	    var newdate = month + "/" + day + "/" + year + ' ' + hours + ':' + minutes + ' ' + AMPM;
	    
		endDateField.value = newdate;
	});
	
	var addTable = Ti.UI.createTableView({
		width:Ti.UI.FILL,
		height:Ti.UI.SIZE,
		top:8,
		right:8,
		left:8,
		borderWidth:1,
		borderColor:'#CCC',
		borderRadius:2,
		data:addTableData,
		selectionStyle:'NONE',
		scrollable:false
	});
	
	addTable.footerView = Ti.UI.createView({
    	height: 1,
   		backgroundColor: 'transparent'
	});
	
	mainContainerView.add(addTable);

	function populateAddTable(){
		
		var sectionView = Ti.UI.createView({
			backgroundColor:'#F5F5F5',
			height:24
		});
		
		var sectionLabel = Titanium.UI.createLabel({
		    text: 'Migraine Info',
		    left: 15,
		    height:24,
		    font:{
		    	fontSize:fontSizeVar,
		    	fontFamily:fontFamilyVar
		    },
		    color:'#595959'
		});
		
		sectionView.add(sectionLabel);
		
		var section = Ti.UI.createTableViewSection({
			headerView:sectionView,
			hasChild:false,
			height:24
		});
		
		addTableData.push(section);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Start',
		    left: 15,
		    height:54
		}));
		
		startDateField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'Start',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false
		}));
		
		startDateField.addEventListener('focus', function(e) {
			startDateField.blur();
			endDateTimePickerView.animate(slideDown);
			startDateTimePickerView.animate(slideUp);
			var pickerdatetime = startDateTimePicker.value;
		    var day = parseInt(pickerdatetime.getDate());
		    var month = parseInt(pickerdatetime.getMonth())+1;
		    var year = pickerdatetime.getFullYear();
		    var hours = parseInt(pickerdatetime.getHours());
	        var minutes = parseInt(pickerdatetime.getMinutes());
	        var AMPM = ((pickerdatetime.getHours()>12)?('PM'):'AM');
	        if(hours > 12){
	        	hours = hours-12;
	        }
	        if(hours < 10){
	        	hours = '0' + hours;
	        }
	        if(minutes < 10){
	        	minutes = '0' + minutes;
	        }
		    var newdate = month + "/" + day + "/" + year + ' ' + hours + ':' + minutes + ' ' + AMPM;
		    
			startDateField.value = newdate;
		});
		
		/*setTimeout(function(e){
			startDateField.focus();
		},300);*/
		
		row.add(fieldLabel);
		row.add(startDateField);
		
		addTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'End',
		    left: 15,
		    height:54
		}));
		
		endDateField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'End',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false
		}));
		
		endDateField.addEventListener('focus', function(e) {
			endDateField.blur();
			startDateTimePickerView.animate(slideDown);
			endDateTimePickerView.animate(slideUp);
			var pickerdatetime = endDateTimePicker.value;
		    var day = parseInt(pickerdatetime.getDate());
		    var month = parseInt(pickerdatetime.getMonth())+1;
		    var year = pickerdatetime.getFullYear();
		    var hours = parseInt(pickerdatetime.getHours());
	        var minutes = parseInt(pickerdatetime.getMinutes());
	        var AMPM = ((pickerdatetime.getHours()>12)?('PM'):'AM');
	        if(hours > 12){
	        	hours = hours-12;
	        }
	        if(hours < 10){
	        	hours = '0' + hours;
	        }
	        if(minutes < 10){
	        	minutes = '0' + minutes;
	        }
		    var newdate = month + "/" + day + "/" + year + ' ' + hours + ':' + minutes + ' ' + AMPM;
		    
			endDateField.value = newdate;
		});
		
		row.add(fieldLabel);
		row.add(endDateField);
		
		addTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			backgroundColor:'#FFF',
			layout:'vertical'
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Severity',
		    left: 15,
		    height:34
		}));
		
		row.add(fieldLabel);
		
		var rowView = Ti.UI.createView({
			width:Ti.UI.SIZE,
			height:100,
			layout:'horizontal',
			top:10
		});
		
		for(i=0;i<4;i++){
			if(i==3){
				var rightVar = 2;
			}
			else{
				var rightVar = 0;
			}
			
			if(i==0){
				var textVar = 'Mild';
				var circleColor = '#0F0';
			}
			else if(i==1){
				var textVar = 'Moderate';
				var circleColor = '#FF0';
			}
			else if(i==2){
				var textVar = 'Severe';
				var circleColor = '#FF8300';
			}
			else{
				var textVar = 'Very Severe';
				var circleColor = '#F00';
			}
			
			var containerView = Ti.UI.createView({
				width:Ti.UI.SIZE,
				height:100,
				top:0,
				layout:'vertical'	
			});
			
			var circleView = Titanium.UI.createButton({
				width:70,
				height:70,
				borderRadius:35,
				borderWidth:1,
				borderColor:'#F5F5F5',
				left:2,
				right:rightVar,
				top:2,
				bottom:2,
				backgroundColor:circleColor,
				severityID:i+1,
				title:i+1,
				font:{
			    	fontSize:24,
					fontFamily:fontFamilyVar
			   },
			   color:'#000'
			});
			
			var severityNumberLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    	text:i+1,
			    font:{
			    	fontSize:24,
					fontFamily:fontFamilyVar
			    }
			}));
			
			//circleView.add(severityNumberLabel);
			
			var severityLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    	text:textVar,
			    font:{
			    	fontSize:12,
					fontFamily:fontFamilyVar
			    }
			}));
		
			containerView.add(circleView);
			containerView.add(severityLabel);
			rowView.add(containerView);
			
		}
		
		row.add(rowView);
		
		addTableData.push(row);
		
		var painRow = Ti.UI.createTableViewRow({
			title:'',
			hasChild:true
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Location of Pain',
		    left: 15,
		    height:54
		}));
		
		painRow.add(fieldLabel);
		
		painRow.addEventListener('click', function() {
			var painLocationsWindow = require('/ui/handheld/home/painLocations');
			var callPainLocationsWindow = new painLocationsWindow();
			self.containingTab.open(callPainLocationsWindow);
		});
		
		addTableData.push(painRow);
		
		var triggersRow = Ti.UI.createTableViewRow({
			title:'',
			hasChild:true
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Triggers',
		    left: 15,
		    height:54
		}));
		
		triggersRow.add(fieldLabel);
		
		triggersRow.addEventListener('click', function() {
			var triggersWindow = require('/ui/handheld/home/triggers');
			var callTriggersWindow = new triggersWindow();
			self.containingTab.open(callTriggersWindow);
		});
		
		addTableData.push(triggersRow);
		
		addTable.setData(addTableData);
		
		var sectionView = Ti.UI.createView({
			backgroundColor:'#F5F5F5',
			height:24
		});
	
		var sectionLabel = Titanium.UI.createLabel({
		    text: 'Weather Info',
		    left: 15,
		    height:24,
		    font:{
		    	fontSize:fontSizeVar,
		    	fontFamily:fontFamilyVar
		    },
		    color:'#595959'
		});
		
		sectionView.add(sectionLabel);
		
		var section = Ti.UI.createTableViewSection({
			headerView:sectionView,
			hasChild:false,
			height:24
		});
		
		weatherTableData.push(section);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'City',
		    left: 15,
		    height:54
		}));
		
		cityField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'City',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    returnKeyType:Titanium.UI.RETURNKEY_DONE
		}));
		
		row.add(fieldLabel);
		row.add(cityField);
		
		weatherTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Condition',
		    left: 15,
		    height:54
		}));
		
		conditionField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'Condition',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    returnKeyType:Titanium.UI.RETURNKEY_DONE
		}));
		
		row.add(fieldLabel);
		row.add(conditionField);
		
		weatherTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Temperature',
		    left: 15,
		    height:54
		}));
		
		tempField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'Temperature',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    returnKeyType:Titanium.UI.RETURNKEY_DONE
		}));
		
		row.add(fieldLabel);
		row.add(tempField);
		
		weatherTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Humidity',
		    left: 15,
		    height:54
		}));
		
		humidityField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'Humidity',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    returnKeyType:Titanium.UI.RETURNKEY_DONE
		}));
		
		row.add(fieldLabel);
		row.add(humidityField);
		
		weatherTableData.push(row);
		
		var row = Ti.UI.createTableViewRow({
			title:'',
			hasChild:false,
			font:{
				fontFamily:fontFamilyVar,
				fontSize:12
			}
		});
		
		var fieldLabel = Titanium.UI.createLabel(ef.combine($$.settingsLabel,{
		    text: 'Pressure',
		    left: 15,
		    height:54
		}));
		
		pressureField = Ti.UI.createTextField(ef.combine($$.settingsField,{
		    left: 100,
		    right: 10,
		    hintText: 'Pressure',
		    textAlign: 'right',
		    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		    height:54,
		    autocorrect:false,
		    bubbleParent: false,
		    returnKeyType:Titanium.UI.RETURNKEY_DONE
		}));
		
		row.add(fieldLabel);
		row.add(pressureField);
		
		weatherTableData.push(row);
		
		weatherTable.setData(weatherTableData);
	}
	
	tabbar.addEventListener('focus', function(e) {
		if(e.index == 1){
			addTableData = [];
			weatherTableData = [];
			populateAddTable();
			//startDateTimePickerView.animate(slideUp);
			
			if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE){
				var alertDialog = Ti.UI.createAlertDialog({
					title:'WARNING!',
					message:'Your device is not online.',
					buttonNames:['OK']
				});
				alertDialog.show();
			}
			else{
				loadWeatherData();
			}
		}
	});
	
	function loadWeatherData(){
		
		//loadingView.animate(slideLoadingDown);
		
		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
		Titanium.Geolocation.distanceFilter = 10;
		Titanium.Geolocation.purpose = 'MYgraine needs your location to get your local weather information.';

		Titanium.Geolocation.getCurrentPosition(function(e){
			if (e.error){
				return;
			}
			
			var longitude = e.coords.longitude;
			var latitude = e.coords.latitude;
			var domain = Ti.App.Properties.getString('domain');
			var userid = Ti.App.Properties.getString('userid');
			var saveURL = "http://"+domain+"/model/services/users.cfc?method=setUserLocation";
			var saveData = {
				userid: userid,
			    longitude:longitude,
			    latitude:latitude
			};
		
			Ti.Yahoo.yql('select * from yahoo.maps.findLocation where q="' + latitude + ',' + longitude + '" and gflags="R"', function(f) {
		        var url ='http://weather.yahooapis.com/forecastrss?w='+ f.data.json.ResultSet.Results.woeid + '&u=f';
		        var xhr = Ti.Network.createHTTPClient({
		        	onload: function() {
			            var weather = this.responseXML;
		                var city = weather.documentElement.getElementsByTagName("yweather:location").item(0).getAttribute("city");
		                var temp = weather.documentElement.getElementsByTagName("item").item(0).getElementsByTagName("yweather:condition").item(0).getAttribute("temp");
		                var tempText = weather.documentElement.getElementsByTagName("item").item(0).getElementsByTagName("yweather:condition").item(0).getAttribute("text");
		                var humidity = weather.documentElement.getElementsByTagName("yweather:atmosphere").item(0).getAttribute("humidity");
		                var pressure = weather.documentElement.getElementsByTagName("yweather:atmosphere").item(0).getAttribute("pressure");
		                var unit = weather.documentElement.getElementsByTagName("yweather:units").item(0).getAttribute("temperature");
		                
		                cityField.value = city;
		                tempField.value = temp + ' ' + unit;
		                conditionField.value = tempText;
		                humidityField.value = humidity + ' %';
		                pressureField.value = pressure + ' in';
		                
		                //loadingView.animate(slideLoadingUp);
			        },
			        onerror: function(g) {
			    		Ti.API.info("STATUS: " + this.status);
				    	Ti.API.info("TEXT:   " + this.responseText);
				    	Ti.API.info("ERROR:  " + g.error);
				    	//loadingView.animate(slideLoadingUp);
				    	alert('Error retrieving local weather information.  Please try again later.');
		    		},
		    		timeout:5000
		        });
		        
		        xhr.open('GET',url);
		        xhr.send();
		    });
			
			/*
			var xhr = Ti.Network.createHTTPClient({
		    	onload: function() {
		    		var json = JSON.parse(this.responseText);
		    		var settings = json.SETTINGS[0];
		    		var	countryLabel = settings.COUNTRYLABEL;
		    		
		    		loadingView.animate(slideLoadingUp);
				},
				onerror: function(e) {
		    		Ti.API.info("STATUS: " + this.status);
			    	Ti.API.info("TEXT:   " + this.responseText);
			    	Ti.API.info("ERROR:  " + e.error);
			    	loadingView.animate(slideLoadingUp);
			    	alert('Error retrieving local weather information.  Please try again later.');
		    	},
				timeout:5000
			});
			*/
			
			//xhr.open("GET", saveURL);
			//xhr.send(saveData);
		});
		
	}
	
	var weatherTable = Ti.UI.createTableView({
		width:Ti.UI.FILL,
		height:Ti.UI.SIZE,
		top:8,
		right:8,
		left:8,
		bottom:8,
		borderWidth:1,
		borderColor:'#CCC',
		borderRadius:2,
		data:weatherTableData,
		selectionStyle:'NONE',
		scrollable:false
	});
	
	weatherTable.footerView = Ti.UI.createView({
    	height: 1,
   		backgroundColor: 'transparent'
	});
	
	mainContainerView.add(weatherTable);
	
	return self;
};

module.exports = addForm;