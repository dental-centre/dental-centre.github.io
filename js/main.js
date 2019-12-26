function main() {

    let toggleButtons = document.getElementsByClassName("mobile-menu-toggle");
    for (let i = 0; i < toggleButtons.length; i++) {
        toggleButtons[i].addEventListener("click", function () {
            const menuPopup = document.getElementById("mobile-popup");

            if (menuPopup.classList.contains("popup-active")) {
                menuPopup.classList.remove("popup-active");
                document.body.style.overflow = "unset";
            } else {
                menuPopup.classList.add("popup-active");
                document.body.style.overflow = "hidden";
            }

            if (this.classList.contains("blue")) {
                this.classList.remove("blue");
            } else {
                this.classList.add("blue");
            }
        });
    }

    toggleButtons = document.getElementsByClassName("desktop-menu-toggle");
    for (let i = 0; i < toggleButtons.length; i++) {
        toggleButtons[i].addEventListener("click", function () {
            const menuPopup = document.getElementById("desktop-popup");

            if (menuPopup.classList.contains("popup-active")) {
                menuPopup.classList.remove("popup-active");
                document.body.style.overflow = "unset";
            } else {
                menuPopup.classList.add("popup-active");
                document.body.style.overflow = "hidden";
            }

            if (this.classList.contains("blue")) {
                this.classList.remove("blue");
            } else {
                this.classList.add("blue");
            }
        });
    }

   

    if ($("#register-form #submit")[0]) {
        $("#register-form #submit")[0].addEventListener("click", function () {
            console.log($("#register-form").serializeArray());

            let incomplete = false;
            let inputs = $(".form-container div input");
            for (let i=0; i<inputs.length; i++) {
                if(inputs[i].required) {
                    if(inputs[i].value.length == 0) {
                        inputs[i].style.border = "1px solid red";
                        incomplete = true;
                    }
                    else {
                        inputs[i].style.border = "none";
                    }
                }
            }

            if(incomplete) {
                $('#fill-required-fields').css('display', 'block');
                return;
            }
            else {
                $('#fill-required-fields').css('display', 'none');
            }

            $(".form-overlay").css('display', 'flex');

            $.ajax({
                url: 'https://nodesingh.herokuapp.com/mailserver',
                type: 'post',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                contentType: 'application/json',
                data: JSON.stringify($("#register-form").serializeArray()),
                crossData: true,
                processData: false,
                success: function (data, textStatus, jQxhr) {
                    $(".form-overlay .loading").css('display', 'none');
                    $(".form-overlay .success").css('display', 'block');
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    $(".form-overlay .loading").css('display', 'none');
                    $(".form-overlay .failure").css('display', 'block');
                }
            });
        })
    }
   

    if($('#tableContainer')[0]) {
        let data = $.ajax({
            type: "GET",
            url: "https://raw.githubusercontent.com/dental-centre/dental-centre.github.io/master/data/tarief_2019.csv",
            success: function (response) {
                splitTables(response, $('#tableContainer'));
                addAccordionListeners();
            }
        });
    }

    if($('#tableContainer_en')[0]) {
        let data = $.ajax({
            type: "GET",
            url: "https://raw.githubusercontent.com/dental-centre/dental-centre.github.io/master/data/tarief_2019_en.csv",
            success: function (response) {
                splitTables(response, $('#tableContainer_en'));
                addAccordionListeners();
            }
        });
    }

}

function closeFormOverlay() {
    $(".form-overlay").css('display', 'none');
    $(".form-overlay .loading").css('display', 'block');
    $(".form-overlay .success").css('display', 'none');
    $(".form-overlay .failure").css('display', 'none');
}

function resetForm() {
    closeFormOverlay();
    $('#register-form')[0].reset();
}


function addAccordionListeners() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}

function addCartListeners() {
    let listOfCartButtons = document.getElementsByClassName("cart");
    console.log(listOfCartButtons);
    for (let i = 0; i < listOfCartButtons.length; i++) {
        listOfCartButtons[i].addEventListener('click', addToCart);
    }
}

function addToCart() {
    let cartCounts = document.getElementsByClassName("cart-count");
    for (let i = 0; i < cartCounts.length; i++) {
        let amount = parseInt(cartCounts[i].innerHTML);
        cartCounts[i].innerHTML = amount + 1;
    }
}

function hideLoadFrame() {
    document.getElementById("loading-container").style.display = "none";
}

function toggleWeather() {
    let sunTshirt = document.getElementById("sun-tshirt");
    let sunIcon = document.getElementById("sun-icon");
    let cloudIcon = document.getElementById("cloud-icon");

    if (sunTshirt.classList.contains("visible")) {
        sunTshirt.classList.remove("visible");
        sunIcon.classList.remove("visible");
        cloudIcon.classList.add("visible");
    } else {
        sunTshirt.classList.add("visible");
        cloudIcon.classList.remove("visible");
        sunIcon.classList.add("visible");
    }
    setTimeout(toggleWeather, 6000);
}

function splitTables(tableData, tableContainer) {
    tableData = Papa.parse(tableData).data
    let heading = []
    let tables = []
    let tableNumber = 0
    let tempTable = []
    for(let row in tableData) {
        row = tableData[row]

        if(row[0] == "") {
            continue;  
        }
        else if(row[1] == "") {
            heading[tableNumber] = row[0]
            if(tableNumber!=0) {
                tables[tableNumber - 1] = tempTable
                tempTable = []
            }
            tableNumber += 1
        }
        else {
            tempTable.push(row)
        }
    }

    if(tempTable!=[]) {
        tables[tableNumber - 1] = tempTable
        tempTable = []
    }

    for(let i=0; i<tableNumber; i++) {
        arrayToTable(heading[i], tables[i], tableContainer)
    }
}

function arrayToTable(heading, tableData, tableContainer) {
    var table = $('<table class="tariff-table"></table>');
    var flag = false
    $(tableData).each(function (i, rowData) {
        if(!flag) {
            var row = $('<tr></tr>');
            $(rowData).each(function (j, cellData) {
                row.append($('<th>'+cellData+'</th>'));
            });
            table.append(row);
            flag = true
        }
        else {
            var row = $('<tr></tr>');
            $(rowData).each(function (j, cellData) {
                row.append($('<td>'+cellData+'</td>'));
            });
            table.append(row);
        }
    });
    var accoridion = $('<div class="accordion"></div>')
    var panel = $('<div class="panel"></div>')
    accoridion.append(heading)
    panel.append(table)
    tableContainer.append(accoridion)
    tableContainer.append(panel)
}

window.addEventListener("load", main)