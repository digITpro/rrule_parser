/* ----------------------------------------------------------------------------
	 	Testing case of rrecur-parser.js inspired from
			http://www.kanzaki.com/docs/ical/rrule.html

		date : dec 14 2011

 ---------------------------------------------------------------------------- */


var d = new Date(2011, 10, 15, 19, 18, 00); // tue 15/11/2011 19:18
var scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;UNTIL=20111231T090000Z", true); // sat 31/12/2011 09:00
console.assert(scheduler.rrule_freq == "DAILY");
console.assert(scheduler.rrule_until == (new Date(2011, 11, 31, 9, 0, 0)).getTime());
console.assert(scheduler.rrule_interval == 1);
console.assert(scheduler.rrule_bysecond.in_array("0"));
console.assert(scheduler.rrule_byminute.in_array("18"));
console.assert(scheduler.rrule_byhour.in_array("19"));
console.assert(!scheduler.rrule_byday);
console.assert(!scheduler.rrule_bymonthday);
//console.assert(scheduler.rrule_byyearday == );
//console.assert(scheduler.rrule_byweekno == );
console.assert(!scheduler.rrule_bymonth);
//console.assert(scheduler.rrule_bysetpos == );
console.assert(scheduler.rrule_wkst == "MO");

scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;COUNT=5", true);
console.assert(scheduler.rrule_freq == "DAILY");
console.assert(scheduler.rrule_count == 5);
console.assert(scheduler.rrule_interval == 1);
console.assert(scheduler.rrule_bysecond.in_array("0"));
console.assert(scheduler.rrule_byminute.in_array("18"));
console.assert(scheduler.rrule_byhour.in_array("19"));
console.assert(!scheduler.rrule_byday);
console.assert(!scheduler.rrule_bymonthday);
//console.assert(scheduler.rrule_byyearday == );
//console.assert(scheduler.rrule_byweekno == );
console.assert(!scheduler.rrule_bymonth);
//console.assert(scheduler.rrule_bysetpos == );
console.assert(scheduler.rrule_wkst == "MO");

scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;COUNT=5;INTERVAL=10", true);
console.assert(scheduler.rrule_freq == "DAILY");
console.assert(scheduler.rrule_count == 5);
console.assert(scheduler.rrule_interval == 10);

scheduler = new Scheduler(d, "RRULE:FREQ=WEEKLY;COUNT=5;BYDAY=MO,TU", true);
console.assert(scheduler.rrule_freq == "WEEKLY");
console.assert(scheduler.rrule_count == 5);
console.assert(scheduler.rrule_bysecond.in_array("0"));
console.assert(scheduler.rrule_byminute.in_array("18"));
console.assert(scheduler.rrule_byhour.in_array("19"));
console.assert(scheduler.rrule_byday.in_array("MO") && scheduler.rrule_byday.in_array("TU"));
console.assert(!scheduler.rrule_bymonthday);
//console.assert(scheduler.rrule_byyearday == );
//console.assert(scheduler.rrule_byweekno == );
console.assert(!scheduler.rrule_bymonth);
//console.assert(scheduler.rrule_bysetpos == );
console.assert(scheduler.rrule_wkst == "MO");


console.log("--- Daily for 5 occurrences ---");
d = new Date(2011, 10, 14, 20, 05, 12);
scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;COUNT=5", true);
var occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 5);
console.assert(occurrences.in_array(d.getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 15, 20, 05, 12).getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 16, 20, 05, 12).getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 17, 20, 05, 12).getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 18, 20, 05, 12).getTime()));
//		==> 	"Mon Nov 14 2011 20:05:12 GMT+0100 (CET)",
//			"Tue Nov 15 2011 20:05:12 GMT+0100 (CET)",
//			…,
//			"Wed Nov 18 2011 20:05:12 GMT+0100 (CET)"



console.log("--- Daily for 5 occurrences, but get only 2 days ---");
d = new Date(2011, 10, 14, 20, 05, 12);
scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;COUNT=5", true);
start_at = new Date(2011, 10, 16);
end_at = new Date(2011, 10, 18);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 2);
console.assert(occurrences.in_array(new Date(2011, 10, 16, 20, 05, 12).getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 17, 20, 05, 12).getTime()));

start_at = new Date(2012, 10, 16);
end_at = new Date(2012, 10, 18);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 0);

//		==> 	"Mon Nov 14 2011 20:05:12 GMT+0100 (CET)",
//			"Tue Nov 15 2011 20:05:12 GMT+0100 (CET)",
//			…,
//			"Wed Nov 18 2011 20:05:12 GMT+0100 (CET)"



console.log("--- Daily for 200 occurrences ---");
d = new Date(2011, 10, 14, 20, 05, 12)
scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;COUNT=200", true);
console.assert(scheduler.all_occurrences().length == 200);


console.log("--- Daily until 2 december ---");
d = new Date(2011, 10, 29, 20, 05, 12);
scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;UNTIL=20111202T000000Z", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.in_array(d.getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 30, 20, 05, 12).getTime()));
console.assert(occurrences.in_array(new Date(2011, 11, 1, 20, 05, 12).getTime()));
//		==> 	"Mon Nov 29 2011 20:05:12 GMT+0100 (CET)",
//			"Tue Nov 30 2011 20:05:12 GMT+0100 (CET)",
//			"Wed Dec 01 2011 20:05:12 GMT+0100 (CET)"



console.log("--- Every other day - forever ---");
d = new Date(2011, 10, 14, 20, 05, 12);
start_at = new Date(2011, 10, 17, 20, 05, 12)
end_at = new Date(2011, 10, 26, 20, 05, 12);
scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;INTERVAL=2", true);
console.assert(scheduler.all_occurrences() == null);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.in_array(new Date(2011, 10, 18, 20, 05, 12).getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 20, 20, 05, 12).getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 22, 20, 05, 12).getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 24, 20, 05, 12).getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 26, 20, 05, 12).getTime()));
//		==> 	"Nov 18 2011 20:05:12 GMT+0100 (CET)",
//			"Nov 20 2011 20:05:12 GMT+0100 (CET)",
//			"Nov 22 2011 20:05:12 GMT+0100 (CET)"
//			"Nov 24 2011 20:05:12 GMT+0100 (CET)"
//			"Nov 26 2011 20:05:12 GMT+0100 (CET)"



console.log("--- Every 10 days, 5 occurrences ---");
d = new Date(2011, 10, 14, 20, 05, 12);
scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;INTERVAL=10;COUNT=5", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 5);
console.assert(occurrences[0] == new Date(2011, 10, 14, 20, 05, 12).getTime());
console.assert(occurrences[1] == new Date(2011, 10, 24, 20, 05, 12).getTime());
console.assert(occurrences[2] == new Date(2011, 11, 4, 20, 05, 12).getTime());
console.assert(occurrences[3] == new Date(2011, 11, 14, 20, 05, 12).getTime());
console.assert(occurrences[4] == new Date(2011, 11, 24, 20, 05, 12).getTime());
//		==> 	"Nov 14 2011 20:05:12 GMT+0100 (CET)",
//                      ...,
//			"Dec 24 2011 20:05:12 GMT+0100 (CET)"
// ...modification...



console.log("--- Everyday in January, for 2 years ---");
d = new Date(2011, 0, 1, 9, 0, 0);
scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;UNTIL=20130131T090000Z;BYMONTH=1", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences[0] == new Date(2011, 0, 1, 9, 0, 0).getTime());
console.assert(occurrences[31] == new Date(2012, 0, 1, 9, 0, 0).getTime());
console.assert(occurrences[62] == new Date(2013, 0, 1, 9, 0, 0).getTime());



d = new Date(2011, 0, 1, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=YEARLY;UNTIL=20130131T090000Z;BYMONTH=1;BYDAY=SU,MO,TU,WE,TH,FR,SA", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences[0] == new Date(2011, 0, 1, 9).getTime());
console.assert(occurrences[31] == new Date(2012, 0, 1, 9).getTime());
console.assert(occurrences[62] == new Date(2013, 0, 1, 9).getTime());
//
 // 		==> 	(2011 9:00 AM EDT)January 1-31
 // 	   		(2012 9:00 AM EDT)January 1-31
 // 		   	(2013 9:00 AM EDT)January 1-31
// ...modification...



console.log("--- Weekly for 10 occurrences ---");
d = new Date(1997, 8, 2, 9, 0, 0);
start_at = new Date(1997, 8, 11, 9, 0, 0);
end_at = new Date(1997, 9, 1, 9, 0, 0);
scheduler = new Scheduler(d, "RRULE:FREQ=WEEKLY;COUNT=10", true);
console.assert(scheduler.all_occurrences().length == 10);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 3);
console.assert(occurrences.in_array(new Date(1997, 8, 16, 9, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 23, 9, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 30, 9, 0, 0).getTime()));
//  ==> 	(1997 9:00 AM EDT)September 2,9,16,23,30;October 7,14,21
//   	  	(1997 9:00 AM EST)October 28;November 4



console.log("--- Toutes les semaines le mardi, seulement 2 fois ---");
d = new Date(2011, 11, 5, 8); // lundi 5 déc 2011
start_at = new Date(2011, 11, 1); // 1er déc. 2011
end_at = new Date(2012, 0, 1); // 1er janv. 2012
scheduler = new Scheduler(d, "FREQ=WEEKLY;INTERVAL=1;BYDAY=TU;COUNT=2", true);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 2);
console.assert(occurrences.in_array(new Date(2011, 11, 6, 8).getTime()));
console.assert(occurrences.in_array(new Date(2011, 11, 13, 8).getTime()));

// La dernière occurence tombe le mardi 13 il ne devrait donc plus en avoir après cette date
start_at = new Date(2011, 11, 14); // mercredi 14 déc.
end_at = new Date(2012, 11, 31); // 31 dec. 2012
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 0);



console.log("--- Toutes les semaines le mardi, du 8 dec au 31 dec ---");
d = new Date(2011, 11, 8, 8); // jeudi 8 déc 2011
start_at = new Date(2011, 11, 1); // 1er déc. 2011
end_at = new Date(2012, 0, 1); // 1er janv. 2013
scheduler = new Scheduler(d, "FREQ=WEEKLY;INTERVAL=1;BYDAY=TU;UNTIL=20111231", true);
// 	==> 	(2011 8:00 AM EDT) December 13, 20, 27

console.assert(scheduler.all_occurrences().length == 3);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 3);
console.assert(occurrences.in_array(new Date(2011, 11, 13, 8).getTime()));
console.assert(occurrences.in_array(new Date(2011, 11, 20, 8).getTime()));
console.assert(occurrences.in_array(new Date(2011, 11, 27, 8).getTime()));

// La dernière occurence tombe le mardi 27 il ne devrait donc plus en avoir après cette date
start_at = new Date(2011, 11, 28); // 1er janv. 2012
end_at = new Date(2012, 11, 31); // 31 dec. 2012
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 0);



console.log("--- Weekly until December 24, 2011 ---");
d = new Date(2011, 10, 14, 8);
start_at = new Date(1950, 0, 1);
end_at = new Date(2050, 0, 1);
scheduler = new Scheduler(d, "RRULE:FREQ=WEEKLY;UNTIL=20111224T000000Z", true);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 6);
console.assert(occurrences.in_array(new Date(2011, 10, 14, 8).getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 21, 8).getTime()));
console.assert(occurrences.in_array(new Date(2011, 10, 28, 8).getTime()));
console.assert(occurrences.in_array(new Date(2011, 11, 5, 8).getTime()));
console.assert(occurrences.in_array(new Date(2011, 11, 12, 8).getTime()));
console.assert(occurrences.in_array(new Date(2011, 11, 19, 8).getTime()));
// 		==> 	(2011 8:00 AM EDT)November 14,21,28;December 5,12,19



//// --- Every other week - forever --
//
//  RRULE:FREQ=WEEKLY;INTERVAL=2;WKST=SU
//


console.log("--- Weekly on Tuesday and Thursday for 5 weeks ---");
d = new Date(1997, 8, 2, 8, 0, 0);
scheduler = new Scheduler(d, "RRULE:FREQ=WEEKLY;UNTIL=19971007T000000Z;WKST=SU;BYDAY=TU,TH", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 10);
console.assert(occurrences.in_array(new Date(1997, 8, 2, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 4, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 9, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 11, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 16, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 18, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 23, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 25, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 30, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 2, 8, 0, 0).getTime()));



d = new Date(1997, 8, 2, 8, 0, 0);
scheduler = new Scheduler(d, "RRULE:FREQ=WEEKLY;COUNT=10;WKST=SU;BYDAY=TU,TH", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 10);
console.assert(occurrences.in_array(new Date(1997, 8, 2, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 4, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 9, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 11, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 16, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 18, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 23, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 25, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 30, 8, 0, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 2, 8, 0, 0).getTime()));
//		==>	(1997 8:00 AM EDT)September 2,4,9,11,16,18,23,25,30;October 2



console.log("--- Every other week on Monday, Wednesday and Friday until December 24, 1997, but starting on Tuesday, September 2, 1997 ---");
d = new Date(1997, 8, 2, 8);
scheduler = new Scheduler(d, "RRULE:FREQ=WEEKLY;INTERVAL=2;UNTIL=19971224T000000Z;WKST=SU;BYDAY=MO,WE,FR", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 24);
console.assert(occurrences.in_array(new Date(1997, 8, 3, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 5, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 15, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 17, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 19, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 29, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 1, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 3, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 13, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 15, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 17, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 27, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 29, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 31, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 10, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 12, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 14, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 24, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 26, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 28, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 11, 8, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 11, 10, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 11, 12, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 11, 22, 8).getTime()));
// ==> (1997 9:00 AM EDT)September 2,3,5,15,17,19,29;October
//  1,3,13,15,17
//      (1997 9:00 AM EST)October 27,29,31;November 10,12,14,24,26,28;
//                        December 8,10,12,22
//// ...modification...



console.log("--- Monthly on the 1st Friday for 3 occurrences ---");
d = new Date(1997, 8, 5, 8);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;COUNT=3;BYDAY=1FR", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 3);
console.assert(occurrences.in_array(new Date(1997, 8, 5, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 3, 8).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 7, 8).getTime()));
//		==>	(1997 9:00 AM EDT)September 5;October 3;November 7;

// occurrence after nov 7 shouldn't exist
start_at = new Date(1997, 10, 8);
end_at = new Date(1997, 11, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 0);




console.log("--- Monthly on the 1st Friday until December 24, 1997 ---");
d = new Date(1997, 8, 5, 11);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;UNTIL=19971224T000000Z;BYDAY=1FR", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 4);
console.assert(occurrences.in_array(new Date(1997, 8, 5, 11).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 3, 11).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 7, 11).getTime()));
console.assert(occurrences.in_array(new Date(1997, 11, 5, 11).getTime()));
//		==>	(1997 11:00 AM EDT)September 5;October 3
//      		(1997 11:00 AM EST)November 7;December 5

// occurrence after dec 5 shouldn't exist
start_at = new Date(1997, 11, 6);
end_at = new Date(1998, 1, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 0);



console.log("--- Every other month on the 1st and last Sunday of the month for 5 occurrences ---");
d = new Date(1997, 8, 7, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;INTERVAL=2;COUNT=5;BYDAY=1SU,-1SU", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 5);
console.assert(occurrences.in_array(new Date(1997, 8, 7, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 28, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 2, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 30, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 0, 4, 9).getTime()));
//		==>	(1997 9:00 AM EDT)September 7,28
//		     (1997 9:00 AM EST)November 2,30
//			(1998 9:00 AM EST)January 4



console.log("--- Monthly on the second to last Monday of the month for 6 months ---");
d = new Date(1997, 8, 22, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;COUNT=6;BYDAY=-2MO", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 6);
console.assert(occurrences.in_array(new Date(1997, 8, 22, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 20, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 17, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 11, 22, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 0, 19, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 1, 16, 9).getTime()));
//		==> 	(1997 9:00 AM EDT)September 22;October 20
//      		(1997 9:00 AM EST)November 17;December 22
//      		(1998 9:00 AM EST)January 19;February 16



console.log("--- Monthly on the third to the last day of the month, forever ---");
d = new Date(1997, 8, 28, 9);
start_at = new Date(d);
end_at = new Date(1998, 2, 28);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;BYMONTHDAY=-3", true);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 6);
console.assert(occurrences.in_array(new Date(1997, 8, 28, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 29, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 28, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 11, 29, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 0, 29, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 1, 26, 9).getTime()));
//		==>	(1997 9:00 AM EDT)September 28
//      		(1997 9:00 AM EST)October 29;November 28;December 29
//			(1998 9:00 AM EST)January 29;February 26



console.log("--- Monthly on the 2nd and 15th of the month for 6 occurrences ---");
d = new Date(1997, 8, 2, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;COUNT=6;BYMONTHDAY=2,15", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 6);
console.assert(occurrences.in_array(new Date(1997, 8, 2, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 15, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 2, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 15, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 2, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 15, 9).getTime()));
//		==> 	(1997 9:00 AM EDT)September 2,15;October 2,15;November 2,15;



console.log("--- Monthly on the first and last day of the month for 10 occurrences ---");
d = new Date(1997, 8, 30, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;COUNT=10;BYMONTHDAY=1,-1", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 10);
console.assert(occurrences.in_array(new Date(1997, 8, 30, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 1, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 31, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 1, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 30, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 11, 1, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 11, 31, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 0, 1, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 0, 31, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 1, 1, 9).getTime()));
//		==>	(1997 9:00 AM EDT)September 30;October 1,31;November 1,30;December 1,31
//			(1998 9:00 AM EST)January 1,31;February 1



console.log("--- Every 18 months on the 10th thru 15th of the month for 10 occurrences ---");
d = new Date(1997, 8, 10, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;INTERVAL=18;COUNT=10;BYMONTHDAY=10,11,12,13,14,15", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 10);
console.assert(occurrences.in_array(new Date(1997, 8, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 11, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 12, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 13, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 14, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 15, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 2, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 2, 11, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 2, 12, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 2, 13, 9).getTime()));
////		==>	(1997 9:00 AM EDT)September 10,11,12,13,14,15
//		     (1999 9:00 AM EST)March 10,11,12,13



console.log("--- Every Tuesday, every other month ---");
d = new Date(1997, 8, 2, 9);
start_at = new Date(1997, 10, 18);
end_at = new Date(1998, 0, 18);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;INTERVAL=2;BYDAY=TU", true);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 4);
console.assert(occurrences.in_array(new Date(1997, 10, 18, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 25, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 0, 6, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 0, 13, 9).getTime()));
//		==>	(1997 9:00 AM EST)November 18,25
//      		(1998 9:00 AM EST)January 6,13



console.log("--- Yearly in June and July for 10 occurrences ---");
d = new Date(1997, 5, 10, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=YEARLY;COUNT=10;BYMONTH=6,7", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 10);
console.assert(occurrences.in_array(new Date(1997, 5, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 6, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 5, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 6, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 5, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 6, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2000, 5, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2000, 6, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2001, 5, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2001, 6, 10, 9).getTime()));
//		==>	(1997 9:00 AM EDT)June 10;July 10
//			(1998 9:00 AM EDT)June 10;July 10
//		     (1999 9:00 AM EDT)June 10;July 10
//			(2000 9:00 AM EDT)June 10;July 10
//			(2001 9:00 AM EDT)June 10;July 10
//
//  		Note: Since none of the BYDAY, BYMONTHDAY or BYYEARDAY components are specified, the day is gotten from DTSTART



console.log("--- Every other year on January, February, and March for 10 occurrences ---");
d = new Date(1997, 2, 10, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=YEARLY;INTERVAL=2;COUNT=10;BYMONTH=1,2,3", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 10);
console.assert(occurrences.in_array(new Date(1997, 2, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 0, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 1, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 2, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2001, 0, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2001, 1, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2001, 2, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2003, 0, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2003, 1, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2003, 2, 10, 9).getTime()));
//	==>	(1997 9:00 AM EST)March 10
//		(1999 9:00 AM EST)January 10;February 10;March 10
//		(2001 9:00 AM EST)January 10;February 10;March 10
//		(2003 9:00 AM EST)January 10;February 10;March 10

// occurrence after 10 march 2003 shouldn't exist
start_at = new Date(2003, 2, 11);
end_at = new Date(2010, 0, 1);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 0);



console.log("--- Every 3rd year on the 1st, 100th and 200th day for 10 occurrences ---");
d = new Date(1997, 0, 1, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=YEARLY;INTERVAL=3;COUNT=10;BYYEARDAY=1,100,200", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 10);
console.assert(occurrences.in_array(new Date(1997, 0, 1, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 3, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 6, 19, 9).getTime()));
console.assert(occurrences.in_array(new Date(2000, 0, 1, 9).getTime()));
console.assert(occurrences.in_array(new Date(2000, 3, 9, 9).getTime()));
console.assert(occurrences.in_array(new Date(2000, 6, 18, 9).getTime()));
console.assert(occurrences.in_array(new Date(2003, 0, 1, 9).getTime()));
console.assert(occurrences.in_array(new Date(2003, 3, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(2003, 6, 19, 9).getTime()));
console.assert(occurrences.in_array(new Date(2006, 0, 1, 9).getTime()));
//		==>	(1997 9:00 AM EST)January 1
//		     (1997 9:00 AM EDT)April 10;July 19
//			(2000 9:00 AM EST)January 1
//			(2000 9:00 AM EDT)April 9;July 18
//			(2003 9:00 AM EST)January 1
//			(2003 9:00 AM EDT)April 10;July 19
//			(2006 9:00 AM EST)January 1



console.log("--- Every 20th Monday of the year, forever ---");
d = new Date(1997, 4, 19, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=YEARLY;BYDAY=20MO", true);
start_at = new Date(1997, 4, 1);
end_at = new Date(1997, 4, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 1);
console.assert(occurrences.in_array(new Date(1997, 4, 19, 9).getTime()));


start_at = new Date(1999, 4, 1);
end_at = new Date(1999, 4, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 1);
console.assert(occurrences.in_array(new Date(1999, 4, 17, 9).getTime()));
//	==> 	(1997 9:00 AM EDT)May 19
//      	(1998 9:00 AM EDT)May 18
//      	(1999 9:00 AM EDT)May 17
//		...



console.log("--- Monday of week number 20 (where the default start of the week is Monday), forever ---");
d = new Date(1997, 4, 12, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO", true);
start_at = new Date(1997, 4, 1);
end_at = new Date(1997, 4, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 1);
console.assert(occurrences.in_array(new Date(1997, 4, 12, 9).getTime()));


scheduler = new Scheduler(d, "RRULE:FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO", true);
start_at = new Date(1999, 4, 1);
end_at = new Date(1999, 4, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 1);
console.assert(occurrences.in_array(new Date(1999, 4, 17, 9).getTime()));
//		==>	(1997 9:00 AM EDT)May 12
//		     (1998 9:00 AM EDT)May 11
//		     (1999 9:00 AM EDT)May 17
//			...



console.log("--- Every Thursday in March, forever ---");
d = new Date(1997, 2, 13, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=TH", true);
start_at = new Date(1997, 2, 1);
end_at = new Date(1997, 2, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 3);
console.assert(occurrences.in_array(new Date(1997, 2, 13, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 2, 20, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 2, 27, 9).getTime()));


start_at = new Date(1999, 2, 1);
end_at = new Date(1999, 2, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 4);
console.assert(occurrences.in_array(new Date(1999, 2, 4, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 2, 11, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 2, 18, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 2, 25, 9).getTime()));
//		==>	(1997 9:00 AM EST)March 13,20,27
//		     (1998 9:00 AM EST)March 5,12,19,26
//		     (1999 9:00 AM EST)March 4,11,18,25
//			...



console.log("--- Every Thursday, but only during June, July, and August, forever ---");
d = new Date(1997, 5, 5, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=YEARLY;BYDAY=TH;BYMONTH=6,7,8", true);
start_at = new Date(1997, 5, 15);
end_at = new Date(1997, 6, 15);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 4);
console.assert(occurrences.in_array(new Date(1997, 5, 19, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 5, 26, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 6, 3, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 6, 10, 9).getTime()));


start_at = new Date(1999, 5, 15);
end_at = new Date(1999, 6, 15);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 4);
console.assert(occurrences.in_array(new Date(1999, 5, 17, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 5, 24, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 6, 1, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 6, 8, 9).getTime()));
//		==>	(1997 9:00 AM EDT)June 5,12,19,26;July 3,10,17,24,31;August 7,14,21,28
//		     (1998 9:00 AM EDT)June 4,11,18,25;July 2,9,16,23,30;August 6,13,20,27
//			(1999 9:00 AM EDT)June 3,10,17,24;July 1,8,15,22,29;August 5,12,19,26
//			...
// ...modified...



console.log("--- Every Friday the 13th, forever (occurrences between) ---");
d = new Date(1997, 8, 2, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;BYDAY=FR;BYMONTHDAY=13", true);
start_at = new Date(1997, 8, 15);
end_at = new Date(1999, 11, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 4);
console.assert(occurrences.in_array(new Date(1998, 1, 13, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 2, 13, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 10, 13, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 7, 13, 9).getTime()));
//		==>	(1998 9:00 AM EST)February 13;March 13;November 13
//			(1999 9:00 AM EDT)August 13
//			(2000 9:00 AM EDT)October 13
//			...
// ...modified...


console.log("--- Every Friday the 13th, forever (exdate) ---");
d = new Date(1997, 8, 2, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;UNTIL=19991231T090000Z;BYDAY=FR;BYMONTHDAY=13", true);
scheduler.add_exception_dates([ new Date(1997, 8, 2, 9) ]);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 4);
//console.assert(occurrences.in_array(new Date(1997, 8, 2, 9).getTime())); <-- exdate not matched !
console.assert(occurrences.in_array(new Date(1998, 1, 13, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 2, 13, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 10, 13, 9).getTime()));
console.assert(occurrences.in_array(new Date(1999, 7, 13, 9).getTime()));
//		==>	(1998 9:00 AM EST)February 13;March 13;November 13
//			(1999 9:00 AM EDT)August 13
//			(2000 9:00 AM EDT)October 13
//			...
// ...added...



console.log("--- Every four years, the first Tuesday after a Monday in November, forever (U.S. Presidential Election day) ---")
d = new Date(1996, 10, 5, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=YEARLY;INTERVAL=4;BYMONTH=11;BYDAY=TU;BYMONTHDAY=2,3,4,5,6,7,8", true);
start_at = new Date(1996, 0, 1);
end_at = new Date(2004, 11, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 3);
console.assert(occurrences.in_array(new Date(1996, 10, 5, 9).getTime()));
console.assert(occurrences.in_array(new Date(2000, 10, 7, 9).getTime()));
console.assert(occurrences.in_array(new Date(2004, 10, 2, 9).getTime()));

//		==> 	(1996 9:00 AM EST)November 5
//			(2000 9:00 AM EST)November 7
//			(2004 9:00 AM EST)November 2


console.log("--- The 3rd instance into the month of one of Tuesday, Wednesday or Thursday, for the next 3 months ---");
d = new Date(1997, 8, 4, 9);

scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;COUNT=3;BYDAY=TU,WE,TH;BYSETPOS=3", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 3);
console.assert(occurrences.in_array(new Date(1997, 8, 4, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 7, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 6, 9).getTime()));
// 		==>	(1997 9:00 AM EDT)September 4;October 7;November 6



console.log("--- The 2nd to last weekday of the month ---");
d = new Date(1997, 8, 29, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-2", true);
start_at = new Date(1996, 0, 1);
end_at = new Date(1998, 1, 1);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.length == 5);
console.assert(occurrences.in_array(new Date(1997, 8, 29, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 9, 30, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 10, 27, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 11, 30, 9).getTime()));
console.assert(occurrences.in_array(new Date(1998, 0, 29, 9).getTime()));
//		==>	(1997 9:00 AM EDT)September 29
//			(1997 9:00 AM EST)October 30;November 27;December 30
//			(1998 9:00 AM EST)January 29;February 26;March 30
//			 ...



console.log("--- Every 20 minutes from 9:00 AM to 4:40 PM every day ---");
d = new Date(1997, 8, 2, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=DAILY;BYHOUR=9,10,11,12,13,14,15,16;BYMINUTE=0,20,40", true);
start_at = new Date(1996, 0, 1);
end_at = new Date(2004, 11, 31);
occurrences = scheduler.occurrences_between(start_at, end_at);
console.assert(occurrences.in_array(new Date(1997, 8, 2, 9, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 2, 9, 20).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 2, 9, 40).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 2, 10, 0).getTime()));
// ...
console.assert(occurrences.in_array(new Date(1997, 8, 2, 16, 20).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 2, 16, 40).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 3, 9, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 3, 9, 20).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 3, 9, 40).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 3, 10, 0).getTime()));
// ...
console.assert(occurrences.in_array(new Date(1997, 8, 3, 16, 0).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 3, 16, 20).getTime()));
console.assert(occurrences.in_array(new Date(1997, 8, 3, 16, 40).getTime()));
//  ==> (September 2, 1997 EDT)9:00,9:20,9:40,10:00,10:20,
//                             ... 16:00,16:20,16:40
//      (September 3, 1997 EDT)9:00,9:20,9:40,10:00,10:20,
//                            ...16:00,16:20,16:40


console.log("--- An example where the days generated makes a difference because of WKST ---");
d = new Date(1997, 7, 5, 9);
scheduler = new Scheduler(d, "RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=MO", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 4);
console.assert(occurrences.in_array(new Date(1997, 7, 5, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 7, 10, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 7, 19, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 7, 24, 9).getTime()));
//              ==> (1997 EDT)Aug 5,10,19,24



scheduler = new Scheduler(d, "RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=SU", true);
occurrences = scheduler.all_occurrences();
console.assert(occurrences.length == 4);
console.assert(occurrences.in_array(new Date(1997, 7, 5, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 7, 17, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 7, 19, 9).getTime()));
console.assert(occurrences.in_array(new Date(1997, 7, 31, 9).getTime()));
//              ==> (1997 EDT)August 5,17,19,31