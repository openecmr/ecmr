import {Button, Container, Header, Icon} from "semantic-ui-react";
import { getCurrentUser } from 'aws-amplify/auth';
import {client} from "./ConsoleUtils";
import {I18n} from 'aws-amplify/utils';
import React, {useEffect, useState} from "react";
import Timeline, {TimelineMarkers, TodayMarker, TimelineHeaders, DateHeader, CursorMarker} from 'react-calendar-timeline'
import moment from 'moment/min/moment-with-locales';
import 'react-calendar-timeline/lib/Timeline.css'
import * as queries from "./graphql/queries";

let user;

function toDate(date, timeRange, start) {
    let result = moment(date);

    if (timeRange && start) {
        let split = timeRange.start.split(':');
        result = result
            .add(split[0], 'hour')
            .add(split[1], 'minute')
    } else if (timeRange && !start) {
        let split = timeRange.end.split(':');
        result = result
            .add(split[0], 'hour')
            .add(split[1], 'minute')
    } else if (start) {
        result = result.add(8, 'hour');
    } else if (!start) {
        result = result.add(18, 'hour');
    }
    return result;
}

function startTime(days) {
    const begin = days === 7 ? 2 : days === 3 ? 1 : 0;

    return moment()
        .startOf("day")
        .add(-begin, "day")
        .toDate();
}

function endTime(days) {
    const begin = days === 7 ? 5 : days === 3 ? 2 : 1;

    return moment()
        .startOf("day")
        .add(begin, "day")
        .toDate();
}

// copied from library
const formatOptions = {
    year: {
        long: 'YYYY',
        mediumLong: 'YYYY',
        medium: 'YYYY',
        short: 'YY'
    },
    month: {
        long: 'MMMM YYYY',
        mediumLong: 'MMMM',
        medium: 'MMMM',
        short: 'MM/YY'
    },
    week: {
        long: 'w',
        mediumLong: 'w',
        medium: 'w',
        short: 'w'
    },
    day: {
        long: 'dddd, LL',
        mediumLong: 'dddd, LL',
        medium: 'dd D',
        short: 'D'
    },
    hour: {
        long: 'dddd, LL, HH:00',
        mediumLong: 'L, HH:00',
        medium: 'HH:00',
        short: 'HH'
    },
    minute: {
        long: 'HH:mm',
        mediumLong: 'HH:mm',
        medium: 'HH:mm',
        short: 'mm',
    }
};

function formatLabel(
    [timeStart, timeEnd],
    unit,
    labelWidth
) {
    let format;
    if (labelWidth >= 150) {
        format = formatOptions[unit]['long']
    } else if (labelWidth >= 100) {
        format = formatOptions[unit]['mediumLong']
    } else if (labelWidth >= 50) {
        format = formatOptions[unit]['medium']
    } else {
        format = formatOptions[unit]['short']
    }
    return moment(timeStart.toDate()).format(format);
}


export default function Planner({}) {
    const [rerender, setRerender] = useState(1);
    const [drivers, setDrivers] = useState([]);
    const [transports, setTransports] = useState([]);
    const [daysView, setDaysView] = useState(7);
    const [start, setStart] = useState(startTime(daysView));
    const [end, setEnd] = useState(endTime(daysView));
    const [maxBounds, setMaxBounds] = useState({});
    const [currentBounds, setCurrentBounds] = useState({});

    useEffect(function() {
        (async function() {
            if (!user) {
                return;
            }

            const canvasStartDate = moment(currentBounds.canvasTimeStart).toISOString();
            const canvasEndDate = moment(currentBounds.canvasTimeEnd).toISOString();
            if (maxBounds.start < canvasStartDate && maxBounds.end > canvasEndDate) {
                return;
            } else {
                setMaxBounds({
                    start: maxBounds.start < canvasStartDate ? maxBounds.start : canvasStartDate,
                    end: maxBounds.end > canvasEndDate ? maxBounds.end : canvasEndDate,
                });
            }

            const response = await client.graphql({query: 
                queries.contractsByOwnerArrivalDate, variables: {
                    arrivalDate: {
                        between: [canvasStartDate, canvasEndDate]
                    },
                    limit: 100,
                    owner: user.username
                }});
            const existing = transports.map(x => x.id);
            const newTransports = response.data.contractsByOwnerArrivalDate.items
                .filter(x => existing.indexOf(x.id) === -1)
                .map(x => ({
                    id: x.id,
                    group: x.driverDriverId || "unassigned",
                    start_time: toDate(x.arrivalDate, x.arrivalTime, true),
                    end_time: toDate(x.deliveryDate, x.deliveryTime, false),
                    title: (x.pickup.city || x.pickup.name) + ' -> ' + (x.delivery.city || x.delivery.name)
                }));
            setTransports([...transports, ...newTransports]);
        })();
    }, [currentBounds]);

    function onBoundsChange(canvasTimeStart, canvasTimeEnd) {
        setCurrentBounds({canvasTimeStart, canvasTimeEnd})
    }

    useEffect(function() {

        (async function() {
            user = await getCurrentUser();

            const driversResponse = await client.graphql({query:
                queries.driverByOwner, variables: {
                    limit: 50,
                    owner: user.username
                }});
            await onBoundsChange(start, end);

            setDrivers([
                ...driversResponse.data.driverByOwner.items.map(x => ({id: x.id, title: x.name})),
                {
                    id: "unassigned",
                    title: I18n.get("Not assigned")
                }
            ]);
            setRerender(true);
        })();
    }, []);

    useEffect(function() {
        goToToday();
    }, [daysView]);

    useEffect(function() {
        onBoundsChange(start, end);
    }, [start, end]);

    function goToToday() {
        setStart(startTime(daysView));
        setEnd(endTime(daysView));
        setRerender(rerender + 1);
    }

    function changeDaysView(newDaysView) {
        setDaysView(newDaysView);
    }

    function onItemClick(itemId, e, time) {
        window.open(`/transports/${itemId}`, "_blank");
    }

    function onTimeChange(visibleTimeStart, visibleTimeEnd, updateScrollCanvas) {
        if (visibleTimeEnd - visibleTimeStart === daysView * 86400 * 1000) {
            updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
        }
    }

    return <div>
        <Header as={'h2'}>{I18n.get("Planner")}</Header>
        <Container  fluid={true} style={{paddingBottom: 40, clear: "both"}}>
                <Button onClick={goToToday} floated={"right"} >
                    <Icon name='time'/> {I18n.get('Today')}
                </Button>
                <Button onClick={() => changeDaysView(7)} floated={"right"} >
                    <Icon name='time'/> {I18n.get('Week')}
                </Button>
                <Button onClick={() => changeDaysView(3)} floated={"right"} >
                    <Icon name='time'/> {I18n.get('3 days')}
                </Button>
                <Button onClick={() => changeDaysView(1)} floated={"right"} >
                    <Icon name='time'/> {I18n.get('1 day')}
                </Button>
        </Container>

        <Timeline
            key={rerender}
            onTimeChange={onTimeChange}
            maxZoom={daysView * 86400 * 1000}
            minZoom={daysView * 86400 * 1000}
            groups={drivers}
            items={transports}
            defaultTimeStart={start}
            defaultTimeEnd={end}
            onBoundsChange={onBoundsChange}
            lineHeight={60}
            itemHeightRatio={1}
            canResize={false}
            canMove={false}
            canChangeGroup={false}
            stackItems={true}
            itemTouchSendsClick={true}
            onItemSelect={onItemClick}
            timeSteps={{
                hour: 1,
                day: 1,
                week: 1
            }}
        >
            <TimelineMarkers>
                <TodayMarker />
                <CursorMarker />
            </TimelineMarkers>
            <TimelineHeaders>
                <DateHeader unit={'primaryHeader'} labelFormat={formatLabel}/>
                <DateHeader secondaryHeader labelFormat={formatLabel}/>

            </TimelineHeaders>
        </Timeline>

    </div>;
}



