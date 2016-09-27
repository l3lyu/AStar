(function() {
    var state = 0;
    var open_list = [];
    var closed_list = [];
    var cell_list = [];
    var destination_list = [];
    var origin_list = [];
    var adjacent_list = [];
    var current_square = null;
    var target_square = null;
    var target_found = false;

    var removeTable = function () {
        document.getElementById('generate').disabled = false;
        document.getElementById('a').disabled = false;
        document.getElementById('b').disabled = false;
        document.getElementById('c').disabled = false;
        document.getElementById('d').disabled = false;
        var tb = document.getElementById('table');
        for (var i = tb.rows.length - 1; i >= 0; i--) {
            tb.deleteRow(i);
        }
        open_list.splice(0,open_list.length);
        closed_list.splice(0,closed_list.length);
        cell_list.splice(0,cell_list.length);
        destination_list.splice(0,destination_list.length);
        origin_list.splice(0,origin_list.length);
        adjacent_list.splice(0,adjacent_list.length);
        target_found = false;
        var row = document.getElementById('rowNumber');
        var col = document.getElementById('columnNumber');
        row.value = '';
        col.value = '';
        state = 0;
    };

    var generateGrid = function () {
        document.getElementById("generate").disabled = true;
        var tb = document.getElementById('table');
        var row = document.getElementById('rowNumber').value;
        var col = document.getElementById('columnNumber').value;
        if(row == 0 || col == 0){
            alert('Please enter row/column number');
            removeTable();
        }
        if(isNaN(row) || isNaN(col)){
            alert('Please enter a number');
            removeTable();
        }
        else {
            for (var i = 0; i < row; i++) {
                var tr = document.createElement('tr');
                for (var j = 0; j < col; j++) {
                    var td = document.createElement('td');
                    td.x = i + 1;
                    td.y = j + 1;
                    cell_list.push(td);
                    td.onclick = function () {
                        if (state == 0) {
                            alert('Please choose starting point/destination/barrier');
                        }
                        else if (state == 1) {
                            if (origin_list[0] == null) {
                                this.style.backgroundColor = '#499B33';
                                origin_list.push(this);
                            }
                            else if (this.x == origin_list[0].x && this.y == origin_list[0].y) {
                                origin_list.pop();
                                this.style.backgroundColor = null;
                            }
                            else {
                                alert('only one starting point can be set');
                            }
                        }
                        else if (state == 2) {
                            if (destination_list[0] == null) {
                                this.style.backgroundColor = 'red';
                                destination_list.push(this);
                            }
                            else if (this.x == destination_list[0].x && this.y == destination_list[0].y) {
                                destination_list.pop();
                                this.style.backgroundColor = null;
                            }
                            else {
                                alert('only one destination can be set');
                            }
                        }
                        else {
                            if (this.style.backgroundColor == 'black') {
                                this.style.backgroundColor = null;
                            }
                            else {
                                this.style.backgroundColor = 'black';
                            }
                        }
                    };
                    tr.appendChild(td);
                }
                tb.appendChild(tr);
            }
        }
    };

    var generateStpoint = function () {
        state = 1;
    };

    var generateEdpoint = function () {
        state = 2;
    };

    var generateWall = function () {
        state = 3;
    };

    function isWall(a) {
        return (a.style.backgroundColor == 'black');
    }

    function isInClosedList(a) {
        for (var i=0; i<closed_list.length; i++){
            if(a.x == closed_list[i].x && a.y == closed_list[i].y)
                return true;
        }
        return false;
    }

    function isInOpenList(a) {
        for(var i=0; i<open_list.length;i++){
            if(a.x == open_list[i].x && a.y == open_list[i].y){
                return true;
            }
        }
        return false;
    }

    function assignH(a){
        for(var i=0; i<cell_list.length; i++) {
            if(cell_list[i].style.backgroundColor == 'red') {
                a.H = Math.abs(cell_list[i].y - a.y) + Math.abs(cell_list[i].x - a.x);
                break;
            }
        }
    }

    function assignG(ParentSquare,thisSquare) {
        thisSquare.G = ParentSquare.G + Math.sqrt(Math.pow(Math.abs(thisSquare.y - ParentSquare.y),2) + Math.pow(Math.abs(thisSquare.x - ParentSquare.x),2));
    }

    function assignF(a) {
        a.F = a.G + a.H;
    }

    function assignCurrentSquare() {
        current_square = open_list[0];
        for(var i=1; i<open_list.length; i++){
            if(open_list[i].F < current_square.F){
                current_square = open_list[i];
            }
        }
        if(current_square.style.backgroundColor == 'red'){
            target_found = true;
        }
        for(var j=0;j<open_list.length;j++){
            if(open_list[j].x == current_square.x && open_list[j].y == current_square.y){
                closed_list.push(open_list[j]);
                open_list.splice(j,1);
                break;
            }
        }
    }

    function assignParentSquare(thisSquare,currentSquare) {
        thisSquare.parentSquare = currentSquare;
        assignG(currentSquare,thisSquare);
        assignF(thisSquare);
    }

    function checkForBetterParent(xSquare,currentSquare) {
        var a = xSquare.G;
        var b = currentSquare.G + Math.sqrt(Math.pow(Math.abs(xSquare.y - currentSquare.y),2) + Math.pow(Math.abs(xSquare.x - currentSquare.x),2));
        if(b<a){
            assignParentSquare(xSquare,currentSquare);
        }
    }

    function pushAdjacentList(currentSquare){
        for(var j=0; j<cell_list.length; j++) {
            if (isWall(cell_list[j]) == false && isInClosedList(cell_list[j]) == false) {
                if ((currentSquare.x - 1) == cell_list[j].x && (currentSquare.y - 1) == cell_list[j].y) {
                    adjacent_list.push(cell_list[j]);
                }
                if ((currentSquare.x - 1) == cell_list[j].x && (currentSquare.y) == cell_list[j].y) {
                    adjacent_list.push(cell_list[j]);
                }
                if ((currentSquare.x - 1) == cell_list[j].x && (currentSquare.y + 1) == cell_list[j].y) {
                    adjacent_list.push(cell_list[j]);
                }
                if ((currentSquare.x) == cell_list[j].x && (currentSquare.y - 1) == cell_list[j].y) {
                    adjacent_list.push(cell_list[j]);
                }
                if ((currentSquare.x) == cell_list[j].x && (currentSquare.y + 1) == cell_list[j].y) {
                    adjacent_list.push(cell_list[j]);
                }
                if ((currentSquare.x + 1) == cell_list[j].x && (currentSquare.y - 1) == cell_list[j].y) {
                    adjacent_list.push(cell_list[j]);
                }
                if ((currentSquare.x + 1) == cell_list[j].x && (currentSquare.y) == cell_list[j].y) {
                    adjacent_list.push(cell_list[j]);
                }
                if ((currentSquare.x + 1) == cell_list[j].x && (currentSquare.y + 1) == cell_list[j].y) {
                    adjacent_list.push(cell_list[j]);
                }
            }
        }
    }

    function pushOpenList(currentSquare){
        for(var i=0;i<adjacent_list.length;i++){
            if(isInOpenList(adjacent_list[i]) == false){
                assignParentSquare(adjacent_list[i],currentSquare);
                open_list.push(adjacent_list[i]);
            }
            else{
                checkForBetterParent(adjacent_list[i],currentSquare);
            }
        }
        adjacent_list.splice(0,adjacent_list.length);
    }

    var generateRoute = function() {
        document.getElementById("a").disabled = true;
        document.getElementById("b").disabled = true;
        document.getElementById("c").disabled = true;
        document.getElementById("d").disabled = true;
        // assignH and G
        for (var i = 0; i < cell_list.length; i++) {
            assignH(cell_list[i]);
            cell_list[i].G = 0;
            cell_list[i].F = cell_list[i].G + cell_list[i].H;
        }

        open_list.push(origin_list[0]);

        while(target_found == false && open_list[0] != null) {
            assignCurrentSquare();
            console.log(current_square.x,current_square.y,current_square.G,current_square.F);
            pushAdjacentList(current_square);
            pushOpenList(current_square);
        }

        target_square = destination_list[0];

        if(target_square.parentSquare == null || target_square.parentSquare.style.backgroundColor == '#499B33'){
            alert('Cannot find path');
        }
        else {
            do {
                target_square.parentSquare.style.backgroundColor = 'purple';
                target_square = target_square.parentSquare;
            }
            while (target_square.parentSquare != origin_list[0]);
        }
    };

    document.getElementById('generate').addEventListener('click',generateGrid);
    document.getElementById('restart').addEventListener('click',removeTable);
    document.getElementById('a').addEventListener('click',generateStpoint);
    document.getElementById('b').addEventListener('click', generateEdpoint);
    document.getElementById('c').addEventListener('click', generateWall);
    document.getElementById('d').addEventListener('click', generateRoute);

})();