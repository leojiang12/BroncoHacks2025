### Start postgresql with Brew

~
base ❯ brew services list
# Name          Status User File
# dbus          none        
# postgresql@14 none        
# unbound       none        

base ❯ brew services start postgresql@14

# ==> Successfully started `postgresql@14` (label: homebrew.mxcl.postgresql@14)

~
base ❯ brew services list

# Name          Status  User     File
# dbus          none             
# postgresql@14 started leojiang ~/Library/LaunchAgents/homebrew.mxcl.postgresql@14.plist
# unbound       none             



# Built-in health check

base ❯ pg_isready

# /tmp:5432 - accepting connections

### Create database

createdb myappdb

### List database

~
base ❯ psql -l

#                              List of databases
#    Name    |  Owner   | Encoding | Collate | Ctype |   Access privileges   
# -----------+----------+----------+---------+-------+-----------------------
#  myappdb   | leojiang | UTF8     | C       | C     | 
#  postgres  | leojiang | UTF8     | C       | C     | 
#  template0 | leojiang | UTF8     | C       | C     | =c/leojiang          +
#            |          |          |         |       | leojiang=CTc/leojiang
#  template1 | leojiang | UTF8     | C       | C     | =c/leojiang          +
#            |          |          |         |       | leojiang=CTc/leojiang
# (4 rows)




