# mysql-update-insert-transform

A tool for transforming MySQL insert statements to update statements and vice versa.

In MySQL Workbench, as with probably many other tools, you are able to output insert and update statements. This is helpful, but you will have to edit in all the substitutions for prepared statements again.
With this tool you only need to write either insert or an update statement and the tool will transform it to the other form.

NOTE: You should probably be using '[UPSERT](http://stackoverflow.com/questions/1218905/how-do-i-update-if-exists-insert-if-not-aka-upsert-or-merge-in-mysql)' pattern to begin with than to write separate insert and update statements, but in case you have to write them separately for some reason, this tool will help.

# Example

![](https://github.com/ahvonenj/mysql-update-insert-transform/blob/master/example_image.PNG?raw=true)
