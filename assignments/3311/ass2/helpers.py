# COMP3311 21T3 Ass2 ... Python helper functions
# add here any functions to share between Python scripts
# you must submit this even if you add nothing

def get_program(db,code):
    cur = db.cursor()
    cur.execute("select * from Programs where code = %s",[code])
    info = cur.fetchone()
    cur.close()
    if not info:
        return None
    else:
        return info

def get_stream(db,code):
    cur = db.cursor()
    cur.execute("select * from Streams where code = %s",[code])
    info = cur.fetchone()
    cur.close()
    if not info:
        return None
    else:
        return info

def get_student(db,zid):
    cur = db.cursor()
    qry = """
    select p.*
    from   People p
           join Students s on s.id = p.id
    where  p.zid = %s
    """
    cur.execute(qry,[zid])
    info = cur.fetchone()
    cur.close()
    if not info:
        return None
    else:
        return info

