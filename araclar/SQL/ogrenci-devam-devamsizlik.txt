SELECT 
    u.firstname,
    u.lastname,
    u.email,
    c.fullname AS course_name,
    FROM_UNIXTIME(ats.sessdate) AS session_date,
    ats.description AS session_description,
    atst.status AS attendance_status

FROM {autoattend_sessions} ats
JOIN {autoattend_students} atst ON atst.attsid = ats.id
JOIN {user} u ON u.id = atst.studentid
JOIN {course} c ON c.id = ats.courseid

WHERE u.deleted = 0
AND ats.sessdate BETWEEN UNIX_TIMESTAMP('2026-02-01') AND UNIX_TIMESTAMP('2026-02-19')

ORDER BY c.fullname, u.lastname, session_date