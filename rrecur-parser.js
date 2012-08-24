// used for IE < 9
// adapted from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(elt /*, from*/)
	{
		var len = this.length >>> 0;

		var from = Number(arguments[1]) || 0;
		from = (from < 0)
				? Math.ceil(from)
				: Math.floor(from);
		if (from < 0)
			from += len;

		for (; from < len; from++)
		{
			if (from in this &&
					this[from] === elt)
				return from;
		}
		return -1;
	};
}

Array.prototype.in_array = function(test_var) { // useful method for "class" Array
	return this.indexOf(test_var, 0) != -1;
}

Date.countMonthDays = function(y, m) { // m : 0->11
	return (new Date(y, m + 1, 0)).getDate();
}

Date.findNthWeekDays = function(y, m, nth, week_day) { // m : false or 0->11, week_day : 0->SU, 1->MO, ..., nth : N (Nth from start of month), -N (Nth from end of month), 0 (all)
	var dates = [];
	if (nth >= 0) {
		if (m === false) { // from start of year
			var date = new Date(y, 0, 1);
			var end_year_ts = new Date(y + 1, 0, 1).getTime();
			var count = 0;
			while (date.getTime() < end_year_ts) {
				if (date.getDay() == week_day) {
					count++;
					if (nth == 0 || count == nth) {
						dates.push(date);
					}
				}
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
			}
		} else { // from start of month
			date = new Date(y, m, 1);
			var end_month_ts = new Date(y, m + 1, 1).getTime();
			count = 0;
			while (date.getTime() < end_month_ts) {
				if (date.getDay() == week_day) {
					count++;
					if (nth == 0 || count == nth) {
						dates.push(date);
					}
				}
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
			}
		}

	} else if (nth < 0) {
		if (m === false) { // from end of year
			nth = Math.abs(nth);
			date = new Date(y + 1, 0, 0);
			var begin_year_ts = new Date(y, 0, 1).getTime();
			count = 0;
			while (date.getTime() >= begin_year_ts) {
				if (date.getDay() == week_day) {
					count++;
					if (nth == 0 || count == nth) {
						dates.push(date);
					}
				}
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1);
			}
		} else { // from end of month
			nth = Math.abs(nth);
			date = new Date(y, m + 1, 0);
			var begin_month_ts = new Date(y, m, 1).getTime();
			count = 0;
			while (date.getTime() >= begin_month_ts) {
				if (date.getDay() == week_day) {
					count++;
					if (nth == 0 || count == nth) {
						dates.push(date);
					}
				}
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1);
			}
		}

	}
	return dates;
}

Date.prototype.isSameDate = function(other_date) {
	return other_date instanceof Date &&
			this.getFullYear() == other_date.getFullYear() &&
			this.getMonth() == other_date.getMonth() &&
			this.getDate() == other_date.getDate();

}

Date.fromWeek = function(nth, y, wkday){ // nth : nth week (1 : first week) of the year y, wkday : day of the week to retrieve (0->SU, 1->MO, ...)
	nth = nth - 1;
	y = y || new Date().getFullYear();
	var d1= new Date(y, 0, 4);
	if (wkday == undefined) wkday = 1;
	return d1.nextWeek(wkday, nth);
}

Date.prototype.nextWeek = function(wd, nth){ // wd : 0->SU, 1->MO, ... (default : same day), nth : how many week to add (default 1)
	if(nth== undefined) nth= 1;
	var incr= nth < 0? 1: -1,
			D= new Date(this), dd= D.getDay();
	if(wd== undefined) wd= dd;
	while(D.getDay()!= wd) D.setDate(D.getDate()+ incr);
	D.setDate(D.getDate()+ 7*nth);
	return D;
}

/**
 * Returns the week number for this date. dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param dowOffset
 * @return int
 */
Date.prototype.getWeekNo = function (dowOffset) { // 0 -> wkst SU, 1 -> wkst MO
	/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

	dowOffset = dowOffset !== undefined ? dowOffset : 0; //default dowOffset to zero
	var newYear = new Date(this.getFullYear(),0,1);
	var day = newYear.getDay() - dowOffset; //the day of week the year begins on
	day = (day >= 0 ? day : day + 7);
	var daynum = Math.floor((this.getTime() - newYear.getTime() -
			(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
	var weeknum;
	//if the year starts before the middle of a week
	if(day < 4) {
		weeknum = Math.floor((daynum+day-1)/7) + 1;
		if(weeknum > 52) {
			var nYear = new Date(this.getFullYear() + 1,0,1);
			var nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/*if the next year starts before the middle of
			 the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53;
		}
	} else {
		weeknum = Math.floor((daynum+day-1)/7);
	}
	return weeknum;
};

Scheduler = function(start_date, rfc_rrule, test_mode) { // Scheduler "class" (global visibility)
	this.init_recurrence_rules = function() {
		// mandatory
		this.rrule_freq = false;

		// both count & until are forbidden
		this.rrule_count = false;
		this.rrule_until = false;

		// facultative
		this.rrule_interval = 1;
		this.rrule_bysecond = false;
		this.rrule_byminute = false;
		this.rrule_byhour = false;
		this.rrule_byday = false; // +1, -2, etc. only for monthly or yearly
		this.rrule_bymonthday = false;
		this.rrule_byyearday = false;
		this.rrule_byweekno = false; // only for yearly
		this.rrule_bymonth = false;
		this.rrule_bysetpos = false; // only in conjonction with others BYxxx rules
		this.rrule_wkst = "MO"; // significant where weekly interval > 1 & where yearly byweekno is specified
	}

	this.test_mode = test_mode === true ? true : false;
	this.start_date = start_date;
	this.start_ts = start_date.getTime();

	this.init_recurrence_rules();
	this.exception_dates = [];
	this.rdates = [];

	this.dayFromDayNo = [ "SU", "MO", "TU", "WE", "TH", "FR", "SA" ];
	this.dayNoFromDay = {
		SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6
	};

	if (rfc_rrule) {
		this.add_recurrence_rules(rfc_rrule);
	}

};

// adds at least one RRULE
Scheduler.prototype.add_recurrence_rules = function(rfc_rrule) {
	if (rfc_rrule.indexOf("RRULE:") == 0) { // removes "RRULE:" if needed
		rfc_rrule = rfc_rrule.slice(6);
	}

	var rules = rfc_rrule.split(";");
	var nb_rules = rules.length;

	for (var i = 0; i < nb_rules; i++) {
		var rule = rules[i].split("=");
		var rule_value = rule[1];
		switch (rule[0]) { // rule name
			case "FREQ":
				this.rrule_freq = rule_value;
				break;
			case "UNTIL":
				var until = rule_value;
				var y = until.substr(0, 4);
				var m = until.substr(4, 2) - 1; // js Date month -> 0 to 11
				var d = until.substr(6, 2);
				if (until.length > 8) {
					var h = until.substr(9, 2);
					var min = until.substr(11, 2);
					var s = until.substr(13, 2);
					this.rrule_until = new Date(y, m, d, h, min, s);
					//this.rrule_until = this.rrule_until.getTime() - this.rrule_until.getTimezoneOffset() * 60000;
				} else {
					this.rrule_until = new Date(y, m, d).getTime();
				}

				break;
			case "COUNT":
				this.rrule_count = rule_value;
				break;
			case "INTERVAL":
				this.rrule_interval = rule_value;
				break;
			case "BYSECOND":
				this.rrule_bysecond = rule_value.split(",");
				break;
			case "BYMINUTE":
				this.rrule_byminute = rule_value.split(",");
				break;
			case "BYHOUR":
				this.rrule_byhour = rule_value.split(",");
				break;
			case "BYDAY":
				this.rrule_byday = rule_value.split(",");
				break;
			case "BYMONTHDAY":
				if (this.rrule_freq != "WEEKLY") {
					this.rrule_bymonthday = rule_value.split(",");
				}
				break;
			case "BYYEARDAY":
				if (this.rrule_freq == "YEARLY") {
					this.rrule_byyearday = rule_value.split(",");
				}
				break;
			case "BYWEEKNO":
				if (this.rrule_freq == "YEARLY") {
					this.rrule_byweekno = rule_value.split(",");
				}
				break;
			case "BYMONTH":
				this.rrule_bymonth = rule_value.split(",");
				break;
			case "BYSETPOS":
				this.rrule_bysetpos = rule_value.split(",");
				this.rrule_bysetpos.sort(function(a,b) {
					return parseInt(a, 10) - parseInt(b, 10);
				});
				break;
			case "WKST":
				this.rrule_wkst = rule_value;
				break;
		}
	}

	//if BYSECOND, BYMINUTE, BYHOUR, BYDAY, BYMONTHDAY or BYMONTH unspecified, fetch values from start date
	if (!this.rrule_bysecond) {
		this.rrule_bysecond = [ this.start_date.getSeconds().toString() ];
	}
	if (!this.rrule_byminute) {
		this.rrule_byminute = [ this.start_date.getMinutes().toString() ];
	}
	if (!this.rrule_byhour) {
		this.rrule_byhour = [ this.start_date.getHours().toString() ];
	}
	if (!this.rrule_byday && this.rrule_freq == "WEEKLY") {// auto value only when freq=weekly i guess...
		this.rrule_byday = [ this.dayFromDayNo[this.start_date.getDay()] ];
	}
	if (!this.rrule_byday && !this.rrule_bymonthday && !this.rrule_byyearday && (this.rrule_freq == "MONTHLY" || this.rrule_freq == "YEARLY")) {
		this.rrule_bymonthday = [ this.start_date.getDate().toString() ];
	}
	if (!this.rrule_byday && !this.rrule_byyearday && !this.rrule_bymonth && this.rrule_freq == "YEARLY") {
		this.rrule_bymonth = [ (this.start_date.getMonth() + 1).toString() ];
	}
}

// removes all RRULEs
Scheduler.prototype.remove_recurrence_rules = function() {
	this.init_recurrence_rules();
}

// adds at least one EXDATE (optional)
Scheduler.prototype.add_exception_dates = function(dates) {
	if(dates) {
		var nb_date = dates.length;
		for (var i = 0; i < nb_date; i++) {
			if(typeof dates[i] == 'string') {
				var date = dates[i]
				dates[i] = parseISO8601(date);
				if(isNaN(dates[i])) {
					dates[i] = new Date(date);
				}
			}
			if(typeof dates[i] == "number") {
				this.exception_dates.push(dates[i]);
			}
			else {
				this.exception_dates.push(dates[i].getTime());
			}
		}
		this.exception_dates.sort();
	}
}

// removes all EXDATEs
Scheduler.prototype.remove_exception_dates = function() {
	this.exception_dates = [];
}

// adds at least one RDATE (optional)
Scheduler.prototype.add_rdates = function(dates) {
	if(dates) {
		var nb_date = dates.length;
		for (var i = 0; i < nb_date; i++) {
			if(typeof dates[i] == 'string') {
				var date = dates[i]
				dates[i] = parseISO8601(date);
				if(isNaN(dates[i])) {
					dates[i] = new Date(date);
				}
			}
			if(typeof dates[i] == "number") {
				this.rdates.push(dates[i]);
			}
			else {
				this.rdates.push(dates[i].getTime());
			}
		}
		this.rdates.sort();
	}
}

// removes all RDATEs
Scheduler.prototype.remove_rdates = function() {
	this.rdates = [];
}

// retourns all occurrences as Date array (test mode => timestamp array)
Scheduler.prototype.all_occurrences = function(filter_begin_ts, filter_end_ts) {
	var occurrences = [];
	if ((filter_begin_ts === undefined || filter_end_ts === undefined) &&
			this.rrule_count === false && this.rrule_until === false) {
		return null; // infinity of results => must be processed with filter_begin_ts & filter_end_ts
	}

	var current_date = this.start_date;
	var count = 0; // used to filter by rrule_count
	var count_period = 0; // used to process intervals

	period_loop:
			while ((this.rrule_count === false || count < this.rrule_count)
					&& (this.rrule_until === false || current_date.getTime() <= this.rrule_until)
					&& (filter_end_ts === undefined || current_date.getTime() <= filter_end_ts)) {

				var day = this.dayFromDayNo[current_date.getDay()];
				var d = current_date.getDate();
				var m = current_date.getMonth() + 1;
				var y = current_date.getFullYear();
				var week_no = current_date.getWeekNo(this.rrule_wkst == "MO" ? 1 : 0); // 1 to 53
				var h = current_date.getHours();
				var min = current_date.getMinutes();
				var s = current_date.getSeconds();

				this.current_pos = 1; // used in rrule_bysetpos
				this.old_pos = []; // used when bysetpos is a negative number

				if (count_period % this.rrule_interval == 0 && this.check_rules(day, d, m, week_no, h, min, s)) { // current date matches interval AND rules byday, bymonthday, bymonth
					if (this.rrule_freq == "DAILY") {
						for (var h_it = 0; h_it < this.rrule_byhour.length; h_it++) {
							for (var min_it = 0; min_it < this.rrule_byminute.length; min_it++) {
								for (var s_it = 0; s_it < this.rrule_bysecond.length; s_it++) {
									var date_to_push = new Date(y, (m-1), d, this.rrule_byhour[h_it], this.rrule_byminute[min_it], this.rrule_bysecond[s_it]);
									var ts_to_push = date_to_push.getTime();
									if (this.rrule_bysetpos !== false && !this.rrule_bysetpos.in_array(this.current_pos.toString())) {
										this.current_pos++;
										this.old_pos.push(date_to_push);
										continue;
									}
									if ((this.rrule_until !== false && ts_to_push > this.rrule_until) ||
											(filter_end_ts !== undefined && ts_to_push > filter_end_ts)) {
										break period_loop;
									}
									if (ts_to_push >= this.start_ts) {
										if (filter_begin_ts === undefined || ts_to_push >= filter_begin_ts) {
											occurrences.push(date_to_push);
										}
										count++;
									}

									this.current_pos++;
									this.old_pos.push(date_to_push);

									if (this.rrule_count !== false && count >= this.rrule_count) {
										break period_loop;
									}
								}
							}
						}
					} else if (["WEEKLY", "MONTHLY", "YEARLY"].in_array(this.rrule_freq)) {
						switch (this.rrule_freq) {
							case "WEEKLY":
								var period_begin = Date.fromWeek(week_no, y, this.rrule_wkst == "MO" ? 1 : 0);
								var until = Date.fromWeek(week_no + 1, y, this.rrule_wkst == "MO" ? 1 : 0);
								break;
							case "MONTHLY":
								period_begin = new Date(y, m - 1, 1)
								until = new Date(y, m, 1);
								break;
							case "YEARLY":
								period_begin = new Date(y, 0, 1);
								until = new Date(y + 1, 0, 1);
								break;
						}

						var it_date = period_begin;

						while (it_date.getTime() < until.getTime()) {
							var it_date_ts = it_date.getTime();
							if ((this.rrule_until !== false && it_date_ts > this.rrule_until) ||
									(filter_end_ts !== undefined && it_date_ts > filter_end_ts)) {
								break period_loop;
							}

							if (this.check_day(it_date)) {

								for (h_it = 0; h_it < this.rrule_byhour.length; h_it++) {
									for (min_it = 0; min_it < this.rrule_byminute.length; min_it++) {
										for (s_it = 0; s_it < this.rrule_bysecond.length; s_it++) {
											date_to_push = new Date(it_date.getFullYear(), it_date.getMonth(), it_date.getDate(), this.rrule_byhour[h_it], this.rrule_byminute[min_it], this.rrule_bysecond[s_it]);
											ts_to_push = date_to_push.getTime();
											if (this.rrule_bysetpos !== false && !this.rrule_bysetpos.in_array(this.current_pos.toString())) {
												this.current_pos++;
												this.old_pos.push(date_to_push);
												continue;
											}
											if ((this.rrule_until !== false && ts_to_push > this.rrule_until) ||
													(filter_end_ts !== undefined && ts_to_push > filter_end_ts)) {
												break period_loop;
											}
											if (ts_to_push >= this.start_ts) {
												if (filter_begin_ts === undefined || ts_to_push >= filter_begin_ts) {
													occurrences.push(date_to_push);
												}
												count++;
											}

											this.current_pos++;
											this.old_pos.push(date_to_push);

											if (this.rrule_count !== false && count >= this.rrule_count) {
												break period_loop;
											}
										}
									}
								}
							}
							it_date = new Date(it_date);
							it_date.setDate(it_date.getDate() + 1);
						}
						// process negative values of rrule_bysetpos
						if (this.rrule_bysetpos instanceof Array) {
							for (var it_pos = 0; it_pos < this.rrule_bysetpos.length; it_pos++) {
								var pos = parseInt(this.rrule_bysetpos[it_pos], 10);
								if (pos < 0) {
									pos = Math.abs(pos);
									var last_matching_dates = this.old_pos.reverse();
									var matching_date = last_matching_dates[pos - 1];
									if (matching_date && matching_date >= this.start_ts) {
										occurrences.push(matching_date);
										count++;
									}
									if (this.rrule_count !== false && count >= this.rrule_count) {
										break period_loop;
									}
								}
							}
						}
					}
				}

				count_period++;
				current_date = this.next_period(current_date);
			}

	// removes exdates
	var nb_occurrences = occurrences.length;
	var occurrences_without_exdates = [];
	for (var i = 0; i < nb_occurrences; i++) {
		var occurrence = occurrences[i];
		var ts = occurrence.getTime();
		if (!(this.exception_dates.in_array(ts))) {
			occurrences_without_exdates.push(this.test_mode ? ts : occurrence);
		}
	}

	// add rdates
	var nb_rdates = this.rdates.length;
	for (var i = 0; i < nb_rdates; i++) {
		var occurrence = new Date(this.rdates[i]);
		if((filter_begin_ts !== undefined && occurrence < filter_begin_ts) || (filter_end_ts !== undefined && occurrence > filter_end_ts)) {
			continue;
		}
		else {
			occurrences_without_exdates.push(this.test_mode ? occurrence.getTime() : occurrence);
		}
	}

	return occurrences_without_exdates;
}

Scheduler.prototype.next_period = function(date) {
	switch (this.rrule_freq) {
		case "DAILY":
			var new_date = new Date(date);
			new_date.setDate(date.getDate() + 1);
			return new_date;
		case "WEEKLY":
			return date.nextWeek();
		case "MONTHLY":
			new_date = new Date(date);
			new_date.setMonth(date.getMonth() + 1, 1);
			return new_date;
		case "YEARLY":
			new_date = new Date(date);
			new_date.setFullYear(date.getFullYear() + 1);
			return new_date;
	}

}

// check validity of selected rules
Scheduler.prototype.check_rules = function(day, d, m, week_no, h, min, s) {
	switch (this.rrule_freq) {
		case "DAILY":
			return ((m === undefined || this.rrule_bymonth === false || this.rrule_bymonth.in_array(m.toString())) &&
					(d === undefined || this.rrule_bymonthday === false || this.rrule_bymonthday.in_array(d.toString())) &&
					(day === undefined || this.rrule_byday === false || this.rrule_byday.in_array(day.toString())));
		case "WEEKLY":
			return ((m === undefined || this.rrule_bymonth === false || this.rrule_bymonth.in_array(m.toString())) &&
					(d === undefined || this.rrule_bymonthday === false || this.rrule_bymonthday.in_array(d.toString())));
		case "MONTHLY":
			return (m === undefined || this.rrule_bymonth === false || this.rrule_bymonth.in_array(m.toString()));
		case "YEARLY":
			return true;
	}
}

// retourns occurrences in the range [ begin_date, end_date ] as Date array (test mode => timestamp array)
Scheduler.prototype.occurrences_between = function(begin_date, end_date) {
	var begin_ts = begin_date.getTime();
	var end_ts = end_date.getTime();

	return this.all_occurrences(begin_ts, end_ts);
}

Scheduler.prototype.check_day = function(date) {
	var is_yearly = (this.rrule_freq == "YEARLY");
	var is_weekly = (this.rrule_freq == "WEEKLY");

	var day = this.dayFromDayNo[date.getDay()];
	var d = date.getDate();
	var m = date.getMonth() + 1;
	var y = date.getFullYear();
	if (is_yearly) {
		var week_no = date.getWeekNo(this.rrule_wkst == "MO" ? 1 : 0); // 1 to 53
	}

	// check rrule_bymonth
	if (this.rrule_bymonth !== false) {
		if (!this.rrule_bymonth.in_array(m.toString())) {
			return false;
		}
	}

	// check rrule_byday
	if (this.rrule_byday !== false) {
		if (is_weekly) {
			if (!this.rrule_byday.in_array(day)) {
				return false;
			}
		} else {
			found = false;
			for (var it_wd = 0; it_wd < this.rrule_byday.length; it_wd++) {
				var rule_byday = /([+0-9-]*)([A-Z]+)/.exec(this.rrule_byday[it_wd]);
				var matching_dates = Date.findNthWeekDays(y, is_yearly ? false : m - 1, rule_byday[1] ? rule_byday[1] : 0, this.dayNoFromDay[rule_byday[2]]);

				for (var it = 0; it < matching_dates.length; it++) {
					if (date.isSameDate(matching_dates[it])) {
						found = true;
						break;
					}
				}
			}
			if (!found) {
				return false;
			}
		}
	}

	if (!is_weekly) {
		// check rrule_bymonthday
		if (this.rrule_bymonthday !== false) {
			var month_days_count = Date.countMonthDays(y, m - 1);
			var d_neg = d - 1 - month_days_count;
			var found = false;
			for (var it_md = 0; it_md < this.rrule_bymonthday.length; it_md++) {
				var md = parseInt(this.rrule_bymonthday[it_md], 10);
				if (d == md || d_neg == md) {
					found = true;
					break;
				}
			}
			if (!found) {
				return false;
			}
		}
	}

	if (is_yearly) {

		// check rrule_byyearday
		if (this.rrule_byyearday !== false) {
			found = false;
			for (var it_yd = 0; it_yd < this.rrule_byyearday.length; it_yd++) {
				var year_day = this.rrule_byyearday[it_yd];
				if (year_day > 0) {
					var year_date = new Date(y, 0, parseInt(year_day, 10));
					if (date.isSameDate(year_date)) {
						found = true;
						break;
					}
				} else if (year_day < 0) {
					year_date = new Date(y + 1, 0, 1 + parseInt(year_day, 10));
					if (date.isSameDate(year_date)) {
						found = true;
						break;
					}
				} else {
					continue;
				}
			}
			if (!found) {
				return false;
			}
		}

		// check rrule_byweekno
		if (this.rrule_byweekno !== false) {
			found = false;
			for (var it_wkno = 0; it_wkno < this.rrule_byweekno.length; it_wkno++) {
				var a_week_no = this.rrule_byweekno[it_wkno];
				if (a_week_no)
					if (a_week_no > 0) {
						if (a_week_no == week_no) {
							found = true;
							break;
						}
					} else if (a_week_no < 0) {
						var year_week_count = new Date(y, 11, 31).getWeekNo();
						if (week_no == year_week_count + 1 + a_week_no) {
							found = true;
							break;
						}
					} else {
						continue;
					}
			}
			if (!found) {
				return false;
			}
		}
	}

	// check rrule_bysetpos processed in period_loop
	return true;
}

