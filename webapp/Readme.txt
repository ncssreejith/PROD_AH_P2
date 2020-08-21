*======================================================================*
*  Application            :  AvMet AH COS
*  Created By             : Sreejith Ravindran
*  Developers			  : Rahul : Template,
						  : Swapnika : Template
						  : Sachin : Template
						  : Priya : Template
						  : Rajat : Template
						  :
*  Created Date           : April 19, 2020
*  Last Modified Date     : April 19, 2020
*  Description			  : This contain the general information about this application
Please use Git
======================================================================*
View Folder Info:
job -> Jobs,Jobs After Defects Completion
def -> Defects to ADD ,  Defects
fair -> FAIR
prf -> PRF
sch -> Scheduled

Sample Codes:
--------------
1) To call Fragment use
that.createoDialog(that, "AvMetNotification", "Notification");
Template : sap.ui.xmlfragment(that.createId(<FRAGID>), “<fragment name>", that);

2) To get UI element from this fragment
sap.ui.core.Fragment.byId(this.createId(< FRAGID >), <element id>)

3) To close fragment
that.closeoDialog(<frag instance>)

General Guildlines:
-------------------
Folder & File naming : Camel case
SubView : Follow Parent naming
Must follow element id and variable naming convention
Base Controller Strictly for generic functions
Use dataUtil for local SET/GET of dataset to local storage [ later this part will be replaced by SQL Anywhere ]
Formatter/utility/Json files must b inside model folder
css and 3rd party lib must be optimized to reduce the size
Properties file must follow -> Label names : use camel case (start with small letter) and Messages : use CAPS
All model name must reprecent its function. Must use view model for view's local properties
All screen should be responsive in all 3 type of devices
Don’t write codes in onAfterRendering without condition