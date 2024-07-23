import React, { useState, useEffect, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { language } from '../Language/Language';
import Searchevent from '../Searchevent/Searchevent';

export default function Customtoolbar( {
    darkMode,
    Views,
    views,
    view,
    setView,
    date,
    setDate,
    mergedList,
    selectedEvent,
    setSelectedEvent,
    loggedInUserData,
    loadEventsFromCalendar,
    loadEventsFromLog,
} ) {
    const [month, setMonth] = useState(moment(date).format('MMMM'));
    const months = moment.months();
  
    const handleSelectMonth = (event) => {
        const current = event.target.value;
        setDate(moment().month(current).toDate());
        setMonth(current);
    };

    const goToView = (view) => {
        setView(view);
    };

    const goToBack =useCallback(() => {
        if (view === Views.DAY) {
        setDate(moment(date).subtract(1, 'd').toDate());
        } else if (view === Views.WEEK) {
        setDate(moment(date).subtract(1, 'w').toDate());
        } else {
        setDate(moment(date).subtract(1, 'M').toDate());
        }
    }, [view, date]);

    const goToNext = useCallback(() => {
        if (view === Views.DAY) {
        setDate(moment(date).add(1, 'd').toDate());
        } else if (view === Views.WEEK) {
        setDate(moment(date).add(1, 'w').toDate());
        } else {
        setDate(moment(date).add(1, 'M').toDate());
        }
    }, [view, date]);

    const goToToday = useCallback(() => {
        setDate(moment().toDate());
    }, []);
    
    const label = useMemo(() => {
        if (view === Views.AGENDA)
            return moment(date).format('YYYY.MM.DD.') + ' – ' + moment(date).add(30, 'd').format('YYYY.MM.DD.');
        if (view === Views.DAY) return moment(date).format('YYYY. MMMM DD. dddd');
        if (view === Views.WEEK) {
        const from = moment(date)?.startOf('week');
        const to = moment(date)?.endOf('week');
        return `${from.format('yyyy. MMMM DD.')} – ${to.format('MMMM DD.')}`;
        }
    }, [view, date]);
    
  return (
    <div className={darkMode ? 'dark-calendar rbc-toolbar px-3' : 'rbc-toolbar px3'}>
      <div className='rbc-btn-group'>
        <button onClick={goToToday}>{language.hu.today}</button>
        <button onClick={goToBack}>{language.hu.previous}</button>
        <button onClick={goToNext}>{language.hu.next}</button>
    </div>
    <div className='rbc-toolbar-label'>
        {view === 'month' ? (
          <>
            <span className='rbc-year'> {moment(date).format('YYYY. ')}</span>
            <select className='rbc-dropdown cursor-pointer' value={month} onChange={handleSelectMonth} id='selectmonth'>
              {months.map((month) => (
                <option
                  value={month}
                  className='cursor-pointer'
                  key={month}
                >
                  {month}
                </option>
              ))}
            </select>
          </>
        ) : (
          label
        )}
    </div>
        <Searchevent
            mergedList={mergedList}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            loggedInUserData={loggedInUserData}
            loadEventsFromCalendar={loadEventsFromCalendar}
            loadEventsFromLog={loadEventsFromLog}
            darkMode={darkMode}
        />
    <div className='rbc-btn-group'>
        {views.map((item) => (
          <button
            onClick={() => goToView(item)}
            key={item}
            className={clsx({ 'rbc-active': view === item })}
          >
            {language.hu[item]}
          </button>
        ))}
      </div>
    </div>
  );
};