// Basit SCORM 1.2 API emülatörü
window.API = {
    LMSInitialize: function() { return "true"; },
    LMSFinish: function() { return "true"; },
    LMSGetValue: function(key) { 
        console.log("GetValue:", key);
        return localStorage.getItem(key) || ""; 
    },
    LMSSetValue: function(key, value) { 
        console.log("SetValue:", key, value);
        localStorage.setItem(key, value); 
        return "true"; 
    },
    LMSCommit: function() { return "true"; },
    LMSGetLastError: function() { return "0"; },
    LMSGetErrorString: function() { return "No error"; },
    LMSGetDiagnostic: function() { return "No diagnostics"; }
};