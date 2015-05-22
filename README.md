# mysql-update-insert(-ajax)-transform

A tool for transforming MySQL insert statements to update statements and vice versa.

In MySQL Workbench, as with probably many other tools, you are able to output insert and update statements. This is helpful, but you will have to edit in all the substitutions for prepared statements again.
With this tool you only need to write either insert or an update statement and the tool will transform it to the other form.

The tool is also supposed to produce exactly what MySQL Workbench would produce... well some spaces are missing after transformation, otherwise it is 95% similar to the MySQL Workbench output.

The tool is not too strict about syntax, but might break in some cases. The more correct the syntax the better the app will work.

NOTE: You should probably be using '[UPSERT](http://stackoverflow.com/questions/1218905/how-do-i-update-if-exists-insert-if-not-aka-upsert-or-merge-in-mysql)' pattern to begin with than to write separate insert and update statements, but in case you have to write them separately for some reason, this tool will help.

# Tool online

The tool can be found online, here: [click](http://ahvonenj.github.io/mysql-update-insert-transform/)

# Version 2

- Implemented a shareable link generation
- Implemented SQL to ajax transform
- Implemented ajax to SQL transform
- Fixed some edge cases with queries and ajax that broke the app

# Examples

![](https://github.com/ahvonenj/mysql-update-insert-transform/blob/master/example_image.PNG?raw=true)

# Example inputs

## Insert

[Link](http://ahvonenj.github.io/mysql-update-insert-transform/?querytype=insert&query=INSERT+INTO+%60somedb%60.%60sometable%60%0A(%60somecolumnA%60%2C%0A%60somecolumnB%60%2C%0A%60somecolumnC%60%2C%0A%60somecolumnD%60%2C%0A%60somecolumnE%60%2C%0A%60somecolumnF%60%2C%0A%60somecolumnG%60%2C%0A%60somecolumnH%60)%0AVALUES%0A(%3AsomesubstitutionA%2C%0A%3AsomesubstitutionB%2C%0A%3AsomesubstitutionC%2C%0A%3AsomesubstitutionD%2C%0A%3AsomesubstitutionE%2C%0A%3AsomesubstitutionF%2C%0A%3AsomesubstitutionG%2C%0A%3AsomesubstitutionH)%3B)

```
INSERT INTO `somedb`.`sometable`
(`somecolumnA`,
`somecolumnB`,
`somecolumnC`,
`somecolumnD`,
`somecolumnE`,
`somecolumnF`,
`somecolumnG`,
`somecolumnH`)
VALUES
(:somesubstitutionA,
:somesubstitutionB,
:somesubstitutionC,
:somesubstitutionD,
:somesubstitutionE,
:somesubstitutionF,
:somesubstitutionG,
:somesubstitutionH);
```

## Update

[Link](http://ahvonenj.github.io/mysql-update-insert-transform/?querytype=update&query=UPDATE+%60somedb%60.%60sometable%60%0ASET%0A%60somecolumnA%60+%3D+%3AsomesubstitutionA%2C%0A%60somecolumnB%60+%3D+%3AsomesubstitutionB%2C%0A%60somecolumnC%60+%3D+%3AsomesubstitutionC%2C%0A%60somecolumnD%60+%3D+%3AsomesubstitutionD%2C%0A%60somecolumnE%60+%3D+%3AsomesubstitutionE%2C%0A%60somecolumnF%60+%3D+%3AsomesubstitutionF%2C%0A%60somecolumnG%60+%3D+%3AsomesubstitutionG%2C%0A%60somecolumnH%60+%3D+%3AsomesubstitutionH%0AWHERE+%60someid%60+%3D+%3Asomevalue%3B)

```
UPDATE `somedb`.`sometable`
SET
`somecolumnA` = :somesubstitutionA,
`somecolumnB` = :somesubstitutionB,
`somecolumnC` = :somesubstitutionC,
`somecolumnD` = :somesubstitutionD,
`somecolumnE` = :somesubstitutionE,
`somecolumnF` = :somesubstitutionF,
`somecolumnG` = :somesubstitutionG,
`somecolumnH` = :somesubstitutionH
WHERE `someid` = :somevalue;
```

## Ajax

[Link](http://ahvonenj.github.io/mysql-update-insert-transform/?querytype=ajax&query=%24.ajax(%0A%7B%0A%09type%3A+%22type%22%2C%0A%09url%3A+%22url%22%2C%0A%09data%3A%0A%09%7B%0A%09%09somecolumnA%3A+%3AsomesubstitutionA%2C%0A%09%09somecolumnB%3A+%3AsomesubstitutionB%2C%0A%09%09somecolumnC%3A+%3AsomesubstitutionC%2C%0A%09%09somecolumnD%3A+%3AsomesubstitutionD%2C%0A%09%09somecolumnE%3A+%3AsomesubstitutionE%2C%0A%09%09somecolumnF%3A+%3AsomesubstitutionF%2C%0A%09%09somecolumnG%3A+%3AsomesubstitutionG%2C%0A%09%09somecolumnH%3A+%3AsomesubstitutionH%0A%09%7D%0A%7D)%3B)

```
$.ajax(
{
	type: "type",
	url: "url",
	data:
	{
		somecolumnA: :somesubstitutionA,
		somecolumnB: :somesubstitutionB,
		somecolumnC: :somesubstitutionC,
		somecolumnD: :somesubstitutionD,
		somecolumnE: :somesubstitutionE,
		somecolumnF: :somesubstitutionF,
		somecolumnG: :somesubstitutionG,
		somecolumnH: :somesubstitutionH
	}
});
```
